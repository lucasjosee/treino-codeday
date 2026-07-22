import { useNavigate } from 'react-router-dom'
import { StateMessage } from '../components/StateMessage'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <StateMessage
        icon="🚫"
        title="Página não encontrada"
        description="O endereço que você acessou não existe."
        actionLabel="Voltar para o início"
        onAction={() => navigate('/')}
      />
    </div>
  )
}
