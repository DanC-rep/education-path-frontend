export type Error = {
   errorCode: string,
   message: string,
   type: ErrorType
   invalidField: string | undefined 
}

enum ErrorType {
   Validation,
   NotFound,
   Failure,
   Conflict,
   Null
}