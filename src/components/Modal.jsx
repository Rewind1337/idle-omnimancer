import { Flex } from './Flex'
import { Paper } from './Paper'
import './Modal.scss'

import { cx } from '../utility/helpers'

export function Modal({
  visible,
  header,
  content,
  footer,
  variant = 'primary',
  onBackdropClick = () => { },
  padding = 8,
  className = ''
}) {
  if (!visible) return null;

  return (
    <div className={cx('modal-backdrop', className)} onClick={(event) => {
      if (event.target === event.currentTarget) onBackdropClick()
    }} style={{ padding: "32px 64px" }} data-variant={variant}>
      <Flex direction='column' className={cx('modal-wrapper')}>
        <Paper layer={0} className={cx('modal-content')}>
          <Flex direction='column' padding={padding} gap={32} className={cx('modal-flex')}>
            {header && (
              <Paper layer={1} className={cx('modal-header')}>
                {header}
              </Paper>
            )}
            {content !== null && content !== undefined && (
              <Paper layer={1} className={cx('modal-content')}>
                {content}
              </Paper>
            )}
            {footer && (
              <Paper layer={1} className={cx('modal-footer')}>
                {footer}
              </Paper>
            )}
          </Flex>
        </Paper>
      </Flex>
    </div>
  )
}