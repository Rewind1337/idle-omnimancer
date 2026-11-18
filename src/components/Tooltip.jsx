import { cloneElement, isValidElement, useId } from 'react'

import { Paper } from './Paper'

import './Tooltip.scss'

import { cx } from '../utility/helpers'
import { Heading } from './Heading'

export function Tooltip({
    children,
    content,
    variant = null,
    layer = 3,
    placement = 'top',
    block = false
}) {
    const id = useId()
    const tooltipId = `tooltip-${id}`
    const anchorName = `--tooltip-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`

    // Pass the tooltip description to the wrapped element for accessibility.
    const trigger = isValidElement(children)
        ? cloneElement(children, {
            'aria-describedby': [
                children.props['aria-describedby'],
                tooltipId
            ].filter(Boolean).join(' ')
        })
        : children

    const validPlacement = ['top', 'bottom'].includes(placement)
        ? placement
        : 'top'

    return (
        <span className={cx('tooltip-trigger', `tooltip-${validPlacement}`, block && 'tooltip-block')}
            style={{ '--tooltip-anchor-name': anchorName }}>
            {trigger}

            <Paper
                id={tooltipId}
                role="tooltip"
                layer={layer}
                variant={variant}
                padding={8}
                className="tooltip-content"
            >
                {typeof content === "string" || typeof content === "number"
                    ? <Heading h="4" weight={500} variant={variant}>{content}</Heading>
                    : content}
            </Paper>
        </span>
    )
}