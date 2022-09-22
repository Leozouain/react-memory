import { useEffect, useState } from 'react'
import * as C from './App.styles'

import logoImage from './assets/devmemory_logo.png'
import RestartIcon from './assets/svgs/restart.svg'

import { InfoItem } from './components/InfoItem'
import { Button } from './components/Button'
import { GridItemType } from './types/GridItemType'

import { formatTimeElapsed } from './helpers/formatTimeElapsed'


import { items } from './data/Items'
import { GridItem } from './components/GridItem/Index'


const App = () => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [moveCount, setMoveCount] = useState<number>(0)
  const [shownCount, setshownCount] = useState<number>(0)
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  useEffect(() => resetAndCreateGrid(), [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        setTimeElapsed(timeElapsed + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [playing, timeElapsed])

  //verify if the game is Over

  useEffect(()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false)
      
    }
  },[moveCount, gridItems])

  // verify if opened are even
  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true)
      if (opened.length === 2) {

        if (opened[0].item === opened[1].item) {
          // v1 - if they are even, make every "shown" permanent
          let tempGrid = [...gridItems]
          for (let i in tempGrid) {
            if (tempGrid[i].shown) {
              tempGrid[i].permanentShown = true
              tempGrid[i].shown = false
            }
          }
          setGridItems(tempGrid)
          setshownCount(0)
        } else {
          setTimeout(() => {
            let tempGrid = [...gridItems]
            //v2 - if they're not even, close all "shown"
            for (let i in tempGrid) {
              tempGrid[i].shown = false
            }
            setGridItems(tempGrid)
            setshownCount(0)

            setMoveCount(moveCount => moveCount +1)
          }, 1000)
        }

      }
    }
  }, [shownCount, gridItems])

  const resetAndCreateGrid = () => {
    // step 1 - Reset the Game
    setTimeElapsed(0)
    setMoveCount(0)
    setshownCount(0)

    //step 2 - Create a Grid
    //step 2.1 - Create a empty Grid
    let tempGrid: GridItemType[] = []
    for (let i = 0; i < (items.length * 2); i++) tempGrid.push({
      item: null, shown: false, permanentShown: false
    })

    //step 2.2 - Fill the Grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1
        while (pos < 0 || tempGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2))
        }
        tempGrid[pos].item = i
      }
    }
    //step 2.3 - Put on State
    setGridItems(tempGrid)

    // step 3 -start the Game
    setPlaying(true)

  }

  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      let tempGrid = [...gridItems]

      if (tempGrid[index].permanentShown === false && tempGrid[index].shown === false) {
        tempGrid[index].shown = true
        setshownCount(shownCount + 1)
      }

      setGridItems(tempGrid)
    }
  }

  return (
    <div >
      <C.Container>
        <C.Info>
          <C.LogoLink href=''>
            <img src={logoImage} width='200' alt="" />
          </C.LogoLink>

          <C.InfoArea>
            <InfoItem label='Timer' value={formatTimeElapsed(timeElapsed)} />
            <InfoItem label='Moves' value={moveCount.toString()} />
          </C.InfoArea>

          <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />

        </C.Info>
        <C.GridArea>
          <C.Grid>
            {gridItems.map((item, index) => (
              <GridItem
                key={index}
                item={item}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </C.Grid>

        </C.GridArea>

      </C.Container>
    </div>
  )
}

export default App