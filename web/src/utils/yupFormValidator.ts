import { ObjectSchema, ValidationError } from 'yup'

type MessageType = 'success' | 'info' | 'error'

interface IAddToastProps {
  message: string
  type: MessageType
}

interface IYupFormValidatorProps {
  schema: ObjectSchema<any>
  data: any
  addToast: (data: IAddToastProps) => void
}

export const yupFormValidator = async ({
  schema,
  data,
  addToast
}: IYupFormValidatorProps): Promise<boolean> => {
  try {
    await schema.validate(data, { abortEarly: false })

    return true
  } catch (err) {
    if (err instanceof ValidationError) {
      err.inner.forEach((error) => {
        addToast({
          type: 'error',
          message: error.message
        })
      })
    } else {
      addToast({
        type: 'error',
        message: 'Ocorreu um erro desconhecido!'
      })
    }

    return false
  }
}
