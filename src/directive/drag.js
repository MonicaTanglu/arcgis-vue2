
const drag = {
    install (Vue) {
        Vue.directive('dragHandle', {
            inserted: (el) => {
                el.addEventListener('mousedown', touch, false)
                document.addEventListener('mouseup', mouseup, false)
            }
        })
        Vue.directive('drag', {
            bind: (el) => {
                el.classList.add('c-drag')
            }
        })
    }

}
var dom = null
var E_SIZER = {}
export function getStyle (el, attr) {
    if (typeof window.getComputedStyle !== 'undefined') {
        return window.getComputedStyle(el, null)[attr]
    } else if (typeof el.currentStyle !== 'undefined') {
        return el.currentStyle[attr]
    }
    return ''
}
export function getParentDom (el) {
    if (el.parentElement.classList.value.indexOf('c-drag') > -1) {
        dom = el.parentElement
        return el.parentElement
    } else {
        return getParentDom(el.parentElement)
    }
}
export function touch (e) {
    let parentDom = getParentDom(e.target)
    e.stopPropagation()
    e.preventDefault()
    let matrix3dReg = /^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/
    let matrixReg = /^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/
    let matrix3dSourceValue = getStyle(parentDom, 'transform')
    let matrix3dArrValue = matrix3dSourceValue.match(matrix3dReg) || matrix3dSourceValue.match(matrixReg)
    E_SIZER['clientX'] = e.clientX
    E_SIZER['clientY'] = e.clientY
    E_SIZER['targetX'] = matrix3dArrValue ? matrix3dArrValue[1] : 0
    E_SIZER['targetY'] = matrix3dArrValue ? matrix3dArrValue[2] : 0

    E_SIZER['distX'] = E_SIZER['clientX'] - E_SIZER['targetX']
    E_SIZER['distY'] = E_SIZER['clientY'] - E_SIZER['targetY']

    document.addEventListener('mousemove', move, false)

}
export function mouseup (e) {
    e.stopPropagation()
    e.preventDefault()

    document.removeEventListener('mousemove', move)
}
export function move (e) {
    e.stopPropagation();
    e.preventDefault();
    let moveY = e.clientY - E_SIZER['distY']
    let moveX = e.clientX - E_SIZER['distX']

    dom.style.transform = `translate3d(${moveX}px,${moveY}px,1px)`

}
export default drag