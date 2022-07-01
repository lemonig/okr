import React, { useEffect } from 'react'
import './index.less'

const WaterLevel = ({ level }) => {
let levelClass=''
  const getText = () => {
    let text
    switch (level) {
      case 1:
        text = 'Ⅰ'
        levelClass="level1"
        break;
      case 2:
        text = 'Ⅱ'
        levelClass="level2"
        break;
      case 3:
        text = 'Ⅲ'
        levelClass="level3"
        break;
      case 4:
        text = 'Ⅳ'
        levelClass="level4"
        break;
      case 5:
        text = 'Ⅴ'
        levelClass="level5"
        break;
      case 6:
        text = '劣Ⅴ'
        levelClass="level6"
        break;
      default:
    }
    return text
  }
  return (
    <div className={'level'+level  +' level_warp'}>

      {
        getText()
      }
    </div>
  )
}

export default WaterLevel
