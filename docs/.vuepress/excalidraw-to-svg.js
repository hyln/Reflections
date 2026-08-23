const PADDING = 16

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function fontFamily(id) {
  if (id === 3)
    return 'Cascadia, Consolas, monospace'
  if (id === 2)
    return 'Helvetica, Arial, sans-serif'
  return 'Virgil, "LXGW WenKai", "KaiTi", cursive, sans-serif'
}

function dash(style) {
  if (style === 'dashed')
    return '8 6'
  if (style === 'dotted')
    return '2 6'
  return null
}

function fill(element) {
  if (!element.backgroundColor || element.backgroundColor === 'transparent')
    return 'none'
  return element.backgroundColor
}

function strokeAttrs(element) {
  const attrs = [
    `stroke="${escapeXml(element.strokeColor || '#1e1e1e')}"`,
    `stroke-width="${element.strokeWidth || 2}"`,
    'stroke-linecap="round"',
    'stroke-linejoin="round"',
  ]
  const dasharray = dash(element.strokeStyle)
  if (dasharray)
    attrs.push(`stroke-dasharray="${dasharray}"`)
  if (element.opacity != null && element.opacity !== 100)
    attrs.push(`opacity="${element.opacity / 100}"`)
  return attrs.join(' ')
}

function transform(element) {
  if (!element.angle)
    return ''
  const width = element.width || 0
  const height = element.height || 0
  const cx = element.x + width / 2
  const cy = element.y + height / 2
  return ` transform="rotate(${element.angle * 180 / Math.PI} ${cx} ${cy})"`
}

function boundsOf(element) {
  if (element.points?.length) {
    const xs = element.points.map(point => element.x + point[0])
    const ys = element.points.map(point => element.y + point[1])
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    }
  }
  return {
    minX: element.x,
    minY: element.y,
    maxX: element.x + (element.width || 0),
    maxY: element.y + (element.height || 0),
  }
}

function sceneBounds(elements) {
  const boxes = elements.map(boundsOf)
  return {
    minX: Math.min(...boxes.map(box => box.minX)) - PADDING,
    minY: Math.min(...boxes.map(box => box.minY)) - PADDING,
    maxX: Math.max(...boxes.map(box => box.maxX)) + PADDING,
    maxY: Math.max(...boxes.map(box => box.maxY)) + PADDING,
  }
}

function pointsAttr(element) {
  return element.points
    .map(point => `${element.x + point[0]},${element.y + point[1]}`)
    .join(' ')
}

function arrowHead(element) {
  if (element.endArrowhead === null || !element.points || element.points.length < 2)
    return ''
  const from = element.points.at(-2)
  const to = element.points.at(-1)
  const x = element.x + to[0]
  const y = element.y + to[1]
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0])
  const size = 12 + (element.strokeWidth || 2) * 2
  const left = [
    x - size * Math.cos(angle - Math.PI / 7),
    y - size * Math.sin(angle - Math.PI / 7),
  ]
  const right = [
    x - size * Math.cos(angle + Math.PI / 7),
    y - size * Math.sin(angle + Math.PI / 7),
  ]
  return `<polygon points="${x},${y} ${left[0]},${left[1]} ${right[0]},${right[1]}" fill="${escapeXml(element.strokeColor || '#1e1e1e')}"${element.opacity != null && element.opacity !== 100 ? ` opacity="${element.opacity / 100}"` : ''}/>`
}

function renderText(element) {
  const lines = (element.text || '').split('\n')
  const fontSize = element.fontSize || 20
  const lineHeight = fontSize * (element.lineHeight || 1.25)
  const anchor = element.textAlign === 'center'
    ? 'middle'
    : element.textAlign === 'right'
      ? 'end'
      : 'start'
  const x = element.textAlign === 'center'
    ? element.x + element.width / 2
    : element.textAlign === 'right'
      ? element.x + element.width
      : element.x
  const blockHeight = lines.length * lineHeight
  const startY = element.verticalAlign === 'middle'
    ? element.y + (element.height - blockHeight) / 2 + lineHeight * 0.8
    : element.verticalAlign === 'bottom'
      ? element.y + element.height - blockHeight + lineHeight * 0.8
      : element.y + lineHeight * 0.8

  return lines.map((line, index) => (
    `<text x="${x}" y="${startY + index * lineHeight}" fill="${escapeXml(element.strokeColor || '#1e1e1e')}" font-size="${fontSize}" font-family="${escapeXml(fontFamily(element.fontFamily))}" text-anchor="${anchor}"${transform(element)}>${escapeXml(line)}</text>`
  )).join('')
}

function renderElement(element, files) {
  const common = `${strokeAttrs(element)}${transform(element)}`

  if (element.type === 'rectangle') {
    const radius = element.roundness ? Math.min(element.width, element.height) * 0.16 : 0
    return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${radius}" fill="${fill(element)}" ${common}/>`
  }

  if (element.type === 'ellipse') {
    return `<ellipse cx="${element.x + element.width / 2}" cy="${element.y + element.height / 2}" rx="${element.width / 2}" ry="${element.height / 2}" fill="${fill(element)}" ${common}/>`
  }

  if (element.type === 'diamond') {
    const cx = element.x + element.width / 2
    const cy = element.y + element.height / 2
    const points = `${cx},${element.y} ${element.x + element.width},${cy} ${cx},${element.y + element.height} ${element.x},${cy}`
    return `<polygon points="${points}" fill="${fill(element)}" ${common}/>`
  }

  if (element.type === 'line' || element.type === 'arrow') {
    const line = `<polyline points="${pointsAttr(element)}" fill="none" ${common}/>`
    return element.type === 'arrow' ? line + arrowHead(element) : line
  }

  if (element.type === 'freedraw') {
    return `<polyline points="${pointsAttr(element)}" fill="none" ${common}/>`
  }

  if (element.type === 'text')
    return renderText(element)

  if (element.type === 'image' && files?.[element.fileId]?.dataURL) {
    return `<image href="${files[element.fileId].dataURL}" x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}"${transform(element)}/>`
  }

  return ''
}

export function renderToSvg(scene) {
  const elements = (scene.elements || []).filter(element => !element.isDeleted)
  if (!elements.length) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
  }

  const box = sceneBounds(elements)
  const width = box.maxX - box.minX
  const height = box.maxY - box.minY
  const background = scene.appState?.viewBackgroundColor
  const bg = background && background !== 'transparent'
    ? `<rect x="${box.minX}" y="${box.minY}" width="${width}" height="${height}" fill="${escapeXml(background)}"/>`
    : ''

  const body = elements.map(element => renderElement(element, scene.files)).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.minX} ${box.minY} ${width} ${height}" width="${width}" height="${height}">${bg}${body}</svg>`
}
