import { styled } from '../../../stitches.config'
import IconArrowDown from 'logos/arrow-hero.svg'
import IconArrowUp from 'logos/arrow-up.svg'

const ArrowDown = styled(IconArrowDown, {
  $$size: 'max(20px, 1.389vw)',
  width: '$$size',
  height: '$$size',
  length: 0
})

const ArrowUp = styled(IconArrowUp, {
  $$size: 'max(20px, 1.389vw)',
  width: '$$size',
  height: '$$size',
  fill: 'white',

  '@bp2': {
    fill: 'none'
  },
  length: 0
})

export { ArrowDown, ArrowUp }
