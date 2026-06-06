import type { Building } from '@/types/building'
import { Pill } from '@/components/atoms/Pill/Pill'
import { AmberBar, Tag, Title, Divider, Body } from '@/components/atoms/Text/Text'
import { ProjectItem } from '@/components/molecules/ProjectItem/ProjectItem'
import { PillRow, ItemsList, CloseButton } from './BuildingLabel.styled'

interface BuildingLabelProps {
  building: Building
  onClose: () => void
  onProjectClick?: (index: number) => void
  activeProjectIndex?: number | null
}

export function BuildingLabel({
  building,
  onClose,
  onProjectClick,
  activeProjectIndex,
}: BuildingLabelProps) {
  return (
    <>
      <AmberBar />
      <Tag>{building.tag}</Tag>
      <Title
        style={{ marginTop: 10 }}
        dangerouslySetInnerHTML={{ __html: building.panelTitle }}
      />
      <Divider />
      <Body>{building.body}</Body>
      {building.stack.length > 0 && (
        <PillRow>
          {building.stack.map(s => <Pill key={s} label={s} />)}
        </PillRow>
      )}
      {building.items.length > 0 && (
        <ItemsList>
          {building.items.map((item, i) => (
            <ProjectItem
              key={item.title}
              item={item}
              isActive={activeProjectIndex === i}
              onClick={() => onProjectClick?.(i)}
            />
          ))}
        </ItemsList>
      )}
      <CloseButton onClick={onClose}>← back</CloseButton>
    </>
  )
}
