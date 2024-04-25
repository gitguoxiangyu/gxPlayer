/** 
 * @description 查看当前的鼠标位置是否在父元素和绝对定位的子元素的组合范围内，如果超出则返回false
 */
export function checkIsMouseInRange(
    parent: HTMLElement,
    topChild: HTMLElement,
    bottom: number,
    pageX: number,
    pageY: number
): boolean {
    // 获取父元素的位置和尺寸
    const parentRect = parent.getBoundingClientRect();
    // 获取子元素的位置和尺寸
    const childRect = topChild.getBoundingClientRect();

    // 计算子元素的绝对位置（相对于文档）
    const childAbsoluteTop = parentRect.top + childRect.top + window.scrollY;
    const childAbsoluteLeft = parentRect.left + childRect.left + window.scrollX;

    // 计算子元素的底部位置，由于子元素是绝对定位，我们可以用传入的bottom参数
    const childAbsoluteBottom = childAbsoluteTop + childRect.height + bottom;

    // 计算子元素的右侧位置
    const childAbsoluteRight = childAbsoluteLeft + childRect.width;

    // 检查鼠标位置是否在父元素的范围内
    const isWithinParent = (
        pageX >= parentRect.left + window.scrollX &&
        pageX <= parentRect.right + window.scrollX &&
        pageY >= parentRect.top + window.scrollY &&
        pageY <= parentRect.bottom + window.scrollY
    );

    // 检查鼠标位置是否在子元素的范围内
    const isWithinChild = (
        pageX >= childAbsoluteLeft &&
        pageX <= childAbsoluteRight &&
        pageY >= childAbsoluteTop &&
        pageY <= childAbsoluteBottom
    );

    // 鼠标需要同时在父元素和子元素的范围内
    return isWithinParent && isWithinChild;
}
