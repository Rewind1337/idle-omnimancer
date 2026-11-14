import { useState } from 'react'
import { Button } from './Button'
import { Flex } from './Flex'
import { Heading } from './Heading'
import { Paper } from './Paper'
import './Paper.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Modal({
  children,
  visible,
  header = <Heading h='1'>Sample Heading</Heading>,
  footerButtons = null,
  variant = 'primary',
  padding = 8
}) {
  const [isVisible, setIsVisible] = useState(visible)
  return (!isVisible ? <></> :
    <div className={cx('modal-backdrop')} style={{ padding: "32px 64px" }} data-variant={variant}>
      <Flex direction='column' className={cx('modal-wrapper')}>
        <Paper layer={0} variant={variant} className={cx('modal-header')}>
          <Flex direction='column' padding={padding} gap={32} className={cx('modal-flex')}>
            <Paper layer={1} className={cx('modal-header')}>
              {header}
            </Paper>
            <Paper layer={1} className={cx('modal-content')}>
              {children}
            </Paper>
            <Paper layer={1} className={cx('modal-footer')}>
              <Flex>
                <Button variant={variant} onClick={() => { setIsVisible(false) }}>Close Modal</Button>
              </Flex>
            </Paper>
          </Flex>
        </Paper>
      </Flex>
    </div>
  )
}