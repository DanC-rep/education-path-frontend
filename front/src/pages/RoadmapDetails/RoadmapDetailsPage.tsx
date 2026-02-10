import { useEffect, useMemo, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import { CircularProgress } from '@mui/material'
import ReactFlow, {
   Background,
   Controls,
   MiniMap,
   MarkerType,
   Node,
   Edge,
   Position,
   NodeProps,
   Handle,
   OnNodeClick,
} from 'reactflow'
import dagre from 'dagrejs'
import 'reactflow/dist/style.css'
import { useAppDispatch, useAppSelector } from '../../shared/redux'
import { roadmapsActions, roadmapsSelectors } from '../../modules/roadmaps/roadmapSlice'
import { getRoadmapByIdThunk } from '../../modules/roadmaps/roadmapsThunk'
import { LessonType, RoadmapLesson } from '../../modules/roadmaps/roadmapApi'

type LessonNodeData = {
   id: string
   title: string
   type: LessonType
   isCompleted: boolean
}

const nodeWidth = 220
const nodeHeight = 96

const lessonTypeStyles: Record<LessonType, string> = {
   Required: 'bg-rose-500/15 text-rose-200 border border-rose-400/40',
   Optional: 'bg-slate-500/10 text-slate-200 border border-slate-400/30',
   Recommended: 'bg-amber-500/15 text-amber-200 border border-amber-400/40',
}

const lessonTypeBorders: Record<LessonType, string> = {
   Required: 'border-rose-400/60',
   Optional: 'border-slate-400/50',
   Recommended: 'border-amber-400/60',
}

function LessonNode({ data }: NodeProps<LessonNodeData>) {
   const statusStyle = data.isCompleted ? 'text-emerald-200' : 'text-slate-300'
   const statusIconStyle = data.isCompleted ? 'text-emerald-300' : 'text-slate-500'
   
   return (
      <div
         className={`block w-[220px] cursor-pointer rounded-xl border bg-slate-900/80 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${lessonTypeBorders[data.type]}`}>
         {/* Handle для входящих связей (сверху) */}
         <Handle 
            type="target" 
            position={Position.Top} 
            className="!bg-slate-500 !w-2 !h-2"
            style={{ pointerEvents: 'none' }}
         />

         <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-semibold text-slate-100">{data.title}</div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${lessonTypeStyles[data.type]}`}>
               {data.type}
            </span>
         </div>
         <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${statusStyle}`}>
            <span className={statusIconStyle} aria-hidden="true">
               <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                  <path d="M5 3a1 1 0 0 1 1 1v1h7.2c.5 0 .8.6.4 1l-2 2 2 2c.4.4.1 1-.4 1H6v5a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Z" />
               </svg>
            </span>
            {data.isCompleted ? 'Выполнен' : 'Не выполнен'}
         </div>

         {/* Handle для исходящих связей (снизу) */}
         <Handle 
            type="source" 
            position={Position.Bottom} 
            className="!bg-slate-500 !w-2 !h-2"
            style={{ pointerEvents: 'none' }}
         />
      </div>
   )
}

const nodeTypes = {
   lesson: LessonNode,
}

const buildEdges = (lessons: RoadmapLesson[]) => {
   const lessonIds = new Set(lessons.map(lesson => lesson.id))
   return lessons.flatMap<Edge>(lesson =>
      lesson.nextLessons
         .filter(nextId => lessonIds.has(nextId))
         .map(nextId => ({
            id: `${lesson.id}-${nextId}`,
            source: lesson.id,
            target: nextId,
            type: 'smoothstep',
            animated: false,
            markerEnd: {
               type: MarkerType.ArrowClosed,
               width: 20,
               height: 20,
               color: '#64748b',
            },
            style: {
               stroke: '#64748b',
               strokeWidth: 2,
            },
         })),
   )
}

const buildLayout = (lessons: RoadmapLesson[]) => {
   const graph = new dagre.graphlib.Graph()
   graph.setDefaultEdgeLabel(() => ({}))

   // Настройка графа для вертикального расположения
   graph.setGraph({
      rankdir: 'TB', // Top to Bottom
      nodesep: 80, // Увеличено расстояние между узлами на одном уровне
      ranksep: 120, // Увеличено расстояние между уровнями
      edgesep: 50, // Увеличено расстояние между ребрами
      marginx: 50,
      marginy: 50,
      ranker: 'tight-tree', // Используем алгоритм для более компактного дерева
   })

   // Добавляем все узлы
   lessons.forEach(lesson => {
      graph.setNode(lesson.id, { 
         width: nodeWidth, 
         height: nodeHeight,
         // Добавляем отступы для обхода
         paddingLeft: 20,
         paddingRight: 20,
         paddingTop: 20,
         paddingBottom: 20,
      })
   })

   // Добавляем все связи
   lessons.forEach(lesson => {
      lesson.nextLessons.forEach(nextId => {
         if (lessons.find(l => l.id === nextId)) {
            graph.setEdge(lesson.id, nextId, {
               minlen: 1, // Минимальная длина ребра
            })
         }
      })
   })

   // Вычисляем layout
   dagre.layout(graph)

   // Создаем узлы для ReactFlow
   const nodes: Node<LessonNodeData>[] = lessons.map(lesson => {
      const position = graph.node(lesson.id)
      return {
         id: lesson.id,
         type: 'lesson',
         data: {
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            isCompleted: lesson.isCompleted,
         },
         position: {
            x: position.x - nodeWidth / 2,
            y: position.y - nodeHeight / 2,
         },
         sourcePosition: Position.Bottom,
         targetPosition: Position.Top,
      }
   })

   const edges = buildEdges(lessons)

   return { nodes, edges }
}

export function RoadmapDetailsPage() {
   const { id } = useParams()
   const navigate = useNavigate()
   const dispatch = useAppDispatch()
   const roadmap = useAppSelector(roadmapsSelectors.selectCurrentRoadmap)
   const fetchStatus = useAppSelector(roadmapsSelectors.selectCurrentRoadmapStatus)
   const error = useAppSelector(roadmapsSelectors.selectCurrentRoadmapError)

   useEffect(() => {
      if (id) {
         dispatch(getRoadmapByIdThunk(id))
      }
      return () => {
         dispatch(roadmapsActions.clearCurrentRoadmap())
      }
   }, [dispatch, id])

   const { nodes, edges } = useMemo(() => {
      if (!roadmap?.lessons?.length) {
         return { nodes: [], edges: [] }
      }
      return buildLayout(roadmap.lessons)
   }, [roadmap])

   // Обработчик клика на узел
   const onNodeClick: OnNodeClick = useCallback(
      (event, node) => {
         navigate(`/lessons/${node.data.id}`)
      },
      [navigate]
   )

   return (
      <div className="p-6 text-slate-100">
         <div className="flex flex-col items-start gap-4">
            <div className="w-full">
               <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">
                  ← Назад к роадмапам
               </Link>
               <h1 className="mt-2 text-2xl font-semibold">{roadmap?.title ?? 'Roadmap details'}</h1>
               <p className="mt-2 w-[80%] max-w-none text-sm text-slate-400">
                  {roadmap?.description ?? 'Здесь будет описание выбранного роадмапа.'}
               </p>
            </div>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
               <span className="font-semibold text-slate-200">Легенда</span>
               <div className="flex flex-wrap gap-2">
                  {(['Required', 'Recommended', 'Optional'] as LessonType[]).map(type => (
                     <span
                        key={type}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${lessonTypeStyles[type]}`}>
                        {type}
                     </span>
                  ))}
               </div>
               <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-200">
                     <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                        <path d="M5 3a1 1 0 0 1 1 1v1h7.2c.5 0 .8.6.4 1l-2 2 2 2c.4.4.1 1-.4 1H6v5a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Z" />
                     </svg>
                     Выполнен
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                     <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                        <path d="M5 3a1 1 0 0 1 1 1v1h7.2c.5 0 .8.6.4 1l-2 2 2 2c.4.4.1 1-.4 1H6v5a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Z" />
                     </svg>
                     Не выполнен
                  </span>
               </div>
            </div>
         </div>

         {fetchStatus === 'loading' && (
            <div className="mt-6 flex items-center gap-2 text-slate-300">
               <CircularProgress size={20} />
               <span>Загрузка роадмапа...</span>
            </div>
         )}

         {fetchStatus === 'failed' && (
            <div className="mt-6 text-rose-300">{error ?? 'Не удалось загрузить роадмап.'}</div>
         )}

         {fetchStatus === 'succeeded' && roadmap && roadmap.lessons.length === 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-slate-600/60 bg-slate-900/30 p-6 text-center">
               <p className="text-slate-300">В этом роадмапе пока нет уроков.</p>
            </div>
         )}

         {fetchStatus === 'succeeded' && roadmap && roadmap.lessons.length > 0 && (
            <div className="mt-8 h-[70vh] min-h-[520px] rounded-2xl border border-slate-800/70 bg-slate-950/40">
               <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodeClick={onNodeClick}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={true}
                  zoomOnScroll={true}
                  panOnScroll={false}
                  defaultEdgeOptions={{
                     type: 'smoothstep',
                     animated: false,
                  }}>
                  <Background gap={24} color="#1f2937" />
                  <MiniMap pannable zoomable className="rounded-lg" />
                  <Controls showInteractive={false} />
               </ReactFlow>
            </div>
         )}
      </div>
   )
}