import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-with-gesture'
import './styles.css'

const cards = [
  'https://64.media.tumblr.com/02ae14e30a52f8e10334aca3cf4f7250/92d54918776494f0-15/s1280x1920/86c3788dacbfbad598de3ba656c0d546942d034b.png',
  'https://64.media.tumblr.com/f26360272144ee756551ad5fad810e5a/92d54918776494f0-3b/s1280x1920/9c8fe73353c157f7528b1d2f1ccc701d736ab3e7.png',
  'https://64.media.tumblr.com/014f53e259cb2445760840ee71281817/92d54918776494f0-a1/s1280x1920/c8abf7de6a492c9a2f2e2dda83f10d84f536a89e.png',
  'https://64.media.tumblr.com/54332a8b522ff07744d9b7bbdb52cc53/92d54918776494f0-d6/s1280x1920/65bebadc6319e448cdbffb3df80a7066efabe79b.png',
  'https://64.media.tumblr.com/743e6b0dea84e712db5db73374261a2b/92d54918776494f0-cc/s1280x1920/d1bb3724ae0a7f41ff9262879b80ec60c4fa8c04.png'
]

const to = i => ({ x: 0, y: i * -4, scale: 0.8, rot: -10 + Math.random() * 10, delay: i * 200 })
const from = i => ({ x: 0, y: i * -4, rot: 0, scale: 0.1, y: -1000 })
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export default  function Deck() {
  const [gone] = useState(() => new Set())
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) }))
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.9
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) gone.add(index)
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
      const scale = down ? 1.0 : 1
      return { x, rot, scale, delay: 0.2, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${cards[i]})` }} />
    </animated.div>
  ))
}