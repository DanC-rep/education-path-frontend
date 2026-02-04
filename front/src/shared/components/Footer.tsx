import { Typography, useTheme } from '@mui/material'
import BookIcon from '@mui/icons-material/Book'

export function Footer() {
   const theme = useTheme()

   return (
      <footer
         className="flex items-center justify-between border-t px-4 py-3"
         style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
         }}>
         <div className="flex items-center gap-2">
            <BookIcon fontSize="small" />
            <Typography variant="body2">Система персональных образовательных траекторий</Typography>
         </div>

         <Typography variant="caption" color="textSecondary">
            © 2025. Barbaridze
         </Typography>
      </footer>
   )
}
