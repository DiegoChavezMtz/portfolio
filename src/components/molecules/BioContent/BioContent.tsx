import { BIO } from '@/lib/constants/bio'
import { Pill } from '@/components/atoms/Pill/Pill'
import { AmberBar, Tag, Title, Divider, Body } from '@/components/atoms/Text/Text'
import { PillRow, Hint } from './BioContent.styled'

interface BioContentProps {
  hintVisible: boolean
  isMobile: boolean
}

export function BioContent({ hintVisible, isMobile }: BioContentProps) {
  return (
    <>
      <AmberBar />
      <Tag>{BIO.tag}</Tag>
      <Title style={{ marginTop: 10 }}>{BIO.title}</Title>
      <Divider />
      <Body>{BIO.body}</Body>
      <PillRow>
        {BIO.stack.map(s => <Pill key={s} label={s} />)}
      </PillRow>
      <Hint $visible={hintVisible}>
        {isMobile ? '↑ tap a building to explore' : BIO.hint}
      </Hint>
    </>
  )
}
