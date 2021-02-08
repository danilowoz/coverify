export interface AlertStrut {
  message: string
  type: 'success' | 'error'
  handleRetry?: () => void
}

export interface ContextProp {
  dispatchAlert: (props: AlertStrut) => void
}
