const canvas = document.querySelector('#cover')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height
const nameField = document.querySelector('#name')
const gravatarField = document.querySelector('#gravatar')
const enField = document.querySelector('#en')
const zhField = document.querySelector('#zh')
const author = '［美］罗伯特·劳伦斯·库恩  著'
const press = '世纪出版集团 上海译文出版社'
const translator = '谈 峥  于 海 江  等译   陆 谷 孙  校'
const padding = [20, 20, 40, 0]
const saveButton = document.querySelector('#save')
const shareButton = document.querySelector('#share')
let img = null
let imgURL = 'dgggj.jpg'
let fileReader = null
let [enTitle, zhTitle, heroName] = ['THE MAN WHO CHANGED BAODING', '他改变了保定', '大咕咕咕鸡']
enField.value = enTitle
zhField.value = zhTitle
nameField.value = heroName

const refreshCover = () => {
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#333'
  ctx.font = '16px sans-serif'
  ctx.fillText(author, width / 2 + 10, 30)

  ctx.font = '14px sans-serif'
  const fWidth = ctx.measureText(press).width
  ctx.fillText(press, (width - fWidth)/2, height - 50 )

  const tWidth = ctx.measureText(translator).width 
  ctx.fillText(translator, (width - tWidth)/2, height - 130)

  renderHeroName()
  renderZhTitle()
  renderEnTitle()
  renderImage()
}


const renderImage = () => {
  if (imgURL) {
    img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 10, width / 2, height / 3)
    }
    img.src = imgURL
  }
}

const renderHeroName = () => {
  ctx.fillStyle = 'white'
  ctx.font = '40px serif'
  const text = `${heroName}传`
  const nWidth = ctx.measureText(text).width
  ctx.fillText(text, width - padding[1] - nWidth, height * 2/3 + 80)
}

renderEnTitle = () => {
  ctx.fillStyle = '#333'
  const fontSize = 50
  ctx.font = `${fontSize}px serif`
  const  enTitlePaddingLeft = 10
  const spaceWidth = ctx.measureText(' ').width
  const words = enTitle.split(' ')
  const maxWidth = width / 2 - padding[1] - enTitlePaddingLeft
  const maxLineNumber = 4
  let cursor = 0
  const lines = [[]]
  const lineWidth = []
  words.forEach((word, idx) => {
    const curWidth = ctx.measureText(word).width
    const nextWidth = cursor + spaceWidth + curWidth
    if (nextWidth > maxWidth) {
      if (lines.length >= 4) {
        cursor = nextWidth
      } else {
        cursor = curWidth
        lines.push([])
      }
    } else {
      cursor = nextWidth
    }
    lines[lines.length - 1].push(word)
    lineWidth[lines.length - 1] = cursor
  })
  lines.forEach((line, idx) => {
    const args = [
      line.join(' '),
      width / 2 + enTitlePaddingLeft,
      padding[0] + 70 + fontSize * idx,
      maxWidth
    ]
    ctx.fillText.apply(ctx, args)
  })
}

const renderZhTitle = () => {
  const zhTitlePaddingLeft = 20
  ctx.fillStyle = 'yellow'
  const fontSize = 110
  ctx.font = `${fontSize}px serif`
  const maxWidth = width - padding[1] - zhTitlePaddingLeft
  const lines = [[]]
  const lineWidth = []
  let cursor = 0
  zhTitle.split('').forEach((char) => {
    const cWidth = ctx.measureText(char).width
    if (cWidth + cursor > maxWidth) {
      if (lines.length >= 2) {
        cursor += cWidth
      } else {
        cursor = cWidth
        lines.push([])
      }
    } else {
      cursor += cWidth
    }
    lines[lines.length - 1].push(char)
    lineWidth[lines.length - 1] = cursor
  })
  lines.forEach((line, idx) => {
    const lineStr =line.join('')
    const strStart = width - lineWidth[idx] - padding[1]
    const args = [lineStr, strStart < zhTitlePaddingLeft ? zhTitlePaddingLeft : strStart, 
      height / 2 + 10 + fontSize * idx, 
      maxWidth]
    ctx.fillText.apply(ctx, args)
  })
}


nameField.onkeyup = (e) => {
  const name = e.target.value.trim()
  if (name) {
    heroName = name
    refreshCover()
  }
}

zhField.onkeyup = (e) => {
  const zh = e.target.value.trim()
  if (zh) {
    zhTitle = zh
    refreshCover()
  }
}

enField.onkeyup = (e) => {
  const en = e.target.value.trim().toUpperCase()
  if (en) {
    enTitle = en
    refreshCover()
  }
}

gravatarField.onchange = (e) => {
  const file = e.target.files[0]
  if (!fileReader) {
    fileReader = new FileReader()
    fileReader.addEventListener('load', () => {
      imgURL = fileReader.result
      refreshCover()
    }, false)
  }
  if (file) {
    fileReader.readAsDataURL(file)
  }
}

refreshCover()

saveButton.onclick = () => {
  const dataUrl = canvas.toDataURL('image/png')
  var link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${heroName}-${zhTitle}.png`;
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  link.dispatchEvent(event);
}

// shareButton.onclick = () => {
//   //
// }
