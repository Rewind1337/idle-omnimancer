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
  padding = 8
}) {
  if (!visible) return null;

  return (
    <div className={cx('modal-backdrop')} onClick={(event) => {
      if (event.target === event.currentTarget) onBackdropClick()
    }} style={{ padding: "32px 64px" }} data-variant={variant}>
      <Flex direction='column' className={cx('modal-wrapper')}>
        <Paper layer={0} variant={variant} className={cx('modal-content')}>
          <Flex direction='column' padding={padding} gap={32} className={cx('modal-flex')}>
            <Paper layer={1} className={cx('modal-header')}>
              {header}
            </Paper>
            <Paper layer={1} className={cx('modal-content')}>
              {content}
            </Paper>
            <Paper layer={1} className={cx('modal-footer')}>
              {footer}
            </Paper>
          </Flex>
        </Paper>
      </Flex>
    </div>
  )
}