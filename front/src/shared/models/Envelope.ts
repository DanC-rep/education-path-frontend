import { Error } from "./Error"

export type Envelope<T> = {
   result: T | null
   errorList: Error[]
   isError: boolean,
   timeGenerated: Date
}