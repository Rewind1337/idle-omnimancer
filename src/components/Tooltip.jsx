import { cloneElement, isValidElement, useId, useState } from 'react'

import { Paper } from './Paper'

import './Tooltip.scss'

import { cx } from '../utility/helpers'
import { Heading } from './Heading'

const renderTooltip = ({
    children,
    content,
    variant,
    layer,
    block,
    placement,
    tooltipId,
    anchorName,
    shouldRenderContent,
    onMouseEnter,
    onMouseLeave,
    onFocusCapture,
    onBlurCapture,
}) => {
    // Pass the tooltip description to the wrapped element for accessibility.
    const trigger = isValidElement(children)
        ? cloneElement(children, {
            'aria-describedby': [
                children.props['aria-describedby'],
                tooltipId
            ].filter(Boolean).join(' ')
        })
        : children

    return (
        <span
            className={cx('tooltip-trigger', 'tooltip-' + placement, block && 'tooltip-block')}
            style={{ '--tooltip-anchor-name': anchorName }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocusCapture={onFocusCapture}
            onBlurCapture={onBlurCapture}
        >
            {trigger}

            <Paper
                id={tooltipId}
                role="tooltip"
                layer={layer}
                variant={variant}
                padding={8}
                className="tooltip-content"
            >
                {shouldRenderContent && (
                    typeof content === "string" || typeof content === "number"
                        ? <Heading h="4" weight={500} variant={variant}>{content}</Heading>
                        : content
                )}
            </Paper>
        </span>
    )
}

function LazyTooltipContent(props) {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return renderTooltip({
        ...props,
        shouldRenderContent: isHovered || isFocused,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onFocusCapture: () => setIsFocused(true),
        onBlurCapture: event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false)
        },
    })
}

export function Tooltip({
    children,
    content,
    variant = null,
    layer = 3,
    placement = 'top',
    block = false,
    lazyContent = false,
}) {
    const id = useId()
    const tooltipId = 'tooltip-' + id
    const anchorName = '--tooltip-anchor-' + id.replace(/[^a-zA-Z0-9_-]/g, '')
    const validPlacement = ['top', 'bottom'].includes(placement)
        ? placement
        : 'top'
    const props = {
        children,
        content,
        variant,
        layer,
        block,
        placement: validPlacement,
        tooltipId,
        anchorName,
    }

    // Only the explicitly lazy tooltips pay for hover/focus state. The many
    // ordinary tooltips in badges and action details remain stateless.
    return lazyContent
        ? <LazyTooltipContent {...props} />
        : renderTooltip({ ...props, shouldRenderContent: true })
}
