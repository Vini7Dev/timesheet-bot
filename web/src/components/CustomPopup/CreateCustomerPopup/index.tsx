import React, { useCallback, useState } from 'react'
import { useApolloClient } from '@apollo/client'

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
    setCreateIsLoading(true)

    try {
      const { data: createCustomerResponse } = await client.mutate<ICreateCustomerResponse>({
        mutation: CREATE_CUSTOMER,
        variables: {
          data: {
            code,
            name
          }
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
  }, [afterSubmit, client, code, name])

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
