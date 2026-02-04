import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Envelope } from '../models/Envelope'

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined) => {
   if (error) {
      if ('status' in error) {
         const errorData = error.data as Envelope<null> | undefined
         if (errorData && errorData.errorList) {
            const messages = errorData.errorList.map(err => {
               return 'Произошла ошибка: ' + err.message
            })
            return messages.join(', ')
         }
         return 'Серверная ошибка'
      }
      return 'Непредвиденная ошибка'
   }
   return ''
}
