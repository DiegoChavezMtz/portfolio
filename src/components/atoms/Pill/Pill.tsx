import { PillWrapper } from './Pill.styled'

interface PillProps {
  label: string
}

export function Pill({ label }: PillProps) {
  return <PillWrapper>{label}</PillWrapper>
}
