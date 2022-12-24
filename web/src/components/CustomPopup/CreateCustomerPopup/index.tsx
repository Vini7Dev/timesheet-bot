import React, { useCallback, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import * as Yup from 'yup'

import { yupFormValidator } from '../../../utils/yupFormValidator'
import { useToast } from '../../../hooks/toast'
import { CREATE_CUSTOMER } from '../../../graphql/createCustomer'
import { Button } from '../../Button'
import { Input } from '../../Input'
import { CreateCustomerForm } from './styles'

interface ICreateCustomerResponse {
  createCustomer: ICustomerProps
}

interface ICreateCustomerPopupProps {
  afterSubmit: (response: ICustomerProps) => void
}

export const CreateCustomerPopup: React.FC<ICreateCustomerPopupProps> = ({
  afterSubmit
}) => {
  const client = useApolloClient()
  const toast = useToast()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const [createIsLoading, setCreateIsLoading] = useState(false)

  const handleCreateCustomer = useCallback(async () => {
    const customerData = {
      code,
      name
    }

    const schema = Yup.object().shape({
      code: Yup.string().required('O código é obrigatório!'),
      name: Yup.string().required('O nome é obrigatório!')
    })

    const isValid = await yupFormValidator({
      schema,
      data: customerData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    setCreateIsLoading(true)

    try {
      const { data: createCustomerResponse } = await client.mutate<ICreateCustomerResponse>({
        mutation: CREATE_CUSTOMER,
        variables: {
          data: customerData
        }
      })

      afterSubmit(createCustomerResponse?.createCustomer as ICustomerProps)
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setCreateIsLoading(false)
  }, [afterSubmit, client, code, name, toast.addToast])

  return (
    <CreateCustomerForm>
      <h1 id="form-title">Cadastrar cliente</h1>

      <div className="input-margin-bottom">
        <Input
          placeholder="Nome do cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-margin-bottom">
        <Input
          placeholder="Código do cliente no multidados"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="button-margin-top">
        <Button text="Cadastrar" onClick={handleCreateCustomer} isLoading={createIsLoading} />
      </div>
    </CreateCustomerForm>
  )
}
