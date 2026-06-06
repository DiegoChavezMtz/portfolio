import type { BuildingItem } from '@/types/building'
import { Pill } from '@/components/atoms/Pill/Pill'
import { Card, CardTitle, CardDesc, CardStack } from './ProjectItem.styled'

interface ProjectItemProps {
  item: BuildingItem
  isActive?: boolean
  onClick?: () => void
}

export function ProjectItem({ item, isActive, onClick }: ProjectItemProps) {
  return (
    <Card $isActive={isActive} onClick={onClick}>
      <CardTitle>{item.title}</CardTitle>
      <CardDesc>{item.desc}</CardDesc>
      <CardStack>
        {item.stack.map(s => <Pill key={s} label={s} />)}
      </CardStack>
    </Card>
  )
}
