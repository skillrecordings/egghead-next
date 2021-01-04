import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {css, keyframes} from '@emotion/core'
import styled from '@emotion/styled'
import axios from 'utils/configured-axios'
import {isEmpty, size} from 'lodash'
import {track} from 'utils/analytics'

import Ghost from './images/Ghost'
import Hearteyes from './images/Hearteyes'
import NeutralFace from './images/NeutralFace'
import Sob from './images/Sob'

const EMOJIS = new Map([
  [<Hearteyes />, 'heart_eyes'],
  [<NeutralFace />, 'neutral_face'],
  [<Sob />, 'sob'],
])

class FeedbackInput extends Component {
  state = {
    emoji: null,
    focused: false,
    loading: false,
    valid: false,
    success: false,
    emojiShown: false,
    errorMessage: null,
    feedbackText: '',
  }

  clearSuccessTimer = null

  onFocus = () => {
    const {location} = this.props
    if (!isEmpty(location)) {
      track('clicked header feedback input', {
        location,
      })
    }
    this.setState({focused: true})
  }

  onEmojiShown = () => {
    this.setState({emojiShown: true})
  }

  onEmojiHidden = () => {
    this.setState({emojiShown: false})
  }

  onEmojiSelect = (emoji) => {
    this.setState({emoji})
    this.textarea.focus()
  }

  onErrorDismiss = () => {
    this.setState({errorMessage: null})
  }

  handleClickOutside = () => {
    this.setState({focused: false})
  }

  onKeyPress = (e) => {
    if (e.keyCode === 27) {
      this.setState({focused: false})
    }
  }

  onSubmit = () => {
    const {emoji} = this.state

    if (this.state.feedbackText === '') {
      this.setState({
        errorMessage: "Your feedback can't be empty",
      })
      return
    }

    this.setState({loading: true})

    const slackEmojiCode = isEmpty(emoji)
      ? ':unicorn_face:'
      : `:${this.state.emoji}:`

    axios
      .post('/api/v1/feedback', {
        feedback: {
          url: window.location.toString(),
          comment: this.textarea.value,
          emotion: slackEmojiCode,
        },
      })
      .then(() => {
        track(`sent feedback`, {
          comment: this.state.feedbackText,
          emotion: slackEmojiCode,
          url: window.location.toString(),
        })
        this.setState({
          loading: false,
          success: true,
          emoji: null,
          feedbackText: '',
          valid: false,
        })
      })
      .catch((err) => {
        this.setState({loading: false, errorMessage: err.message})
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.focused) {
      // textarea was hidden if we were showing an error message and
      // now we hide it
      if (prevState.errorMessage != null && this.state.errorMessage == null) {
        this.textarea.focus()
      }

      if (!prevState.focused) {
        window.addEventListener('keypress', this.onKeyPress)
      }
    } else {
      if (prevState.focused) {
        // needed for when we e.g.: unfocus based on pressing escape
        this.textarea.blur()

        // if we unfocused and there was an error before,
        // clear it
        if (prevState.errorMessage) {
          this.setState({errorMessage: null})
        }

        // if we had a success message
        // clear it
        if (prevState.success) {
          this.setState({success: false})
        }

        window.removeEventListener('keypress', this.onKeyPress)
      }
    }

    if (this.state.success) {
      // forget about input state
      this.textarea.value = ''

      // collapse in 5s
      this.clearSuccessTimer = setTimeout(() => {
        if (!document.hidden) {
          this.setState({success: false})
        }
      }, 3500)
    } else {
      if (prevState.success) {
        clearTimeout(this.clearSuccessTimer)
        this.clearSuccessTimer = null
      }

      if (prevState.success && this.state.focused) {
        this.setState({focused: false})
      }
    }
  }

  componentWillUnmount() {
    if (this.clearSuccessTimer !== null) {
      clearTimeout(this.clearSuccessTimer)
      this.clearSuccessTimer = null
    }

    window.removeEventListener('keypress', this.onKeyPress)
  }

  render() {
    const {
      valid,
      loading,
      focused,
      errorMessage,
      success,
      emojiShown,
    } = this.state

    return (
      <FeedbackErrorBoundary>
        <ClickedOutside onClickOutside={this.handleClickOutside}>
          <FeedbackInputMain
            title="Share any feedback about our products and services"
            className={`
            ${focused ? 'focused' : ''}
            ${errorMessage != null ? 'error' : ''}
            ${loading ? 'loading' : ''}
            ${success ? 'success' : ''}
            ${this.props.dark ? 'dark' : ''}
          `}
          >
            <div
              css={css`
                position: absolute;
                z-index: 100;
                width: ${focused ? '230px' : '100%'};
                height: ${focused ? '160px' : '34px'};
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                transition: background 150ms;
                &:hover {
                  color: white;
                  background: #232c3b;
                }
              `}
            >
              {!focused && (
                <div
                  css={css`
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: 1;
                    padding: 7px;
                  `}
                >
                  Feedback
                </div>
              )}
              <FeedbackInputTextarea
                type="text"
                innerRef={(textarea) => (this.textarea = textarea)}
                placeholder={
                  focused ? 'tell us how you feel about it...' : 'Feedback'
                }
                onFocus={this.onFocus}
                onChange={(event) => {
                  this.setState({
                    feedbackText: event.target.value,
                    valid: size(event.target.value) > 5,
                  })
                }}
                css={css`
                  overflow: hidden;
                  background: #232c3b
                    ${!focused &&
                    `cursor: pointer;
              `};
                `}
                disabled={loading === true || errorMessage != null}
                aria-label="give feedback"
              />

              {errorMessage != null && focused && (
                <FeedbackInputErrorMessage>
                  <span>{errorMessage}</span>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      this.onErrorDismiss()
                    }}
                  >
                    TRY AGAIN
                  </a>
                </FeedbackInputErrorMessage>
              )}

              {success && focused && (
                <FeedbackInputSuccessMessage>
                  <p>Your feedback has been sent.</p>
                  <p>Thank you! 🎉</p>
                </FeedbackInputSuccessMessage>
              )}

              {errorMessage == null && !success && focused && (
                <FeedbackInputControls>
                  <span
                    className="emojis"
                    css={css`
                      width: 24px;
                    `}
                  >
                    <EmojiSelector
                      onShow={this.onEmojiShown}
                      onHide={this.onEmojiHidden}
                      onSelect={this.onEmojiSelect}
                      loading={loading}
                      dark={this.props.dark}
                    />
                  </span>
                  <span
                    css={css`
                      color: white;
                      flex-grow: 1;
                      align-items: center;
                      margin-left: 5px;
                      margin-top: 3px;
                      font-size: 10px;
                      opacity: ${emojiShown ? '0;' : ''};
                    `}
                  >
                    {`<- pick one`}
                  </span>
                  <span className={`buttons ${emojiShown ? 'hidden' : ''}`}>
                    <button
                      onClick={this.onSubmit}
                      className="button-reset py-1 px-2 mr-2  cursor-pointer bg-white text-gray-600 rounded-md"
                      css={`
                        ${css`
                        font-size: 12px;
                        &:disabled {
                          opacity: 0.2;
                          margin-right: ${loading ? '10px;' : '0px;'}
                          cursor: ${loading ? 'wait;' : 'not-allowed;'}
                        }
                      `}
                      `}
                      disabled={loading || !valid}
                    >
                      {loading ? 'Sending...' : 'Send'}
                    </button>
                  </span>
                </FeedbackInputControls>
              )}
            </div>
          </FeedbackInputMain>
        </ClickedOutside>
      </FeedbackErrorBoundary>
    )
  }
}

const appearAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const appearToEightyAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: .8;
  }
`

const FeedbackInputTextarea = styled('textarea')`
  appearance: none;
  border-width: 0;
  background: none;
  padding: 7px;
  font-size: 14px;
  line-height: 1.25;
  font-family: sans-serif;
  width: 100%;
  resize: none;
  vertical-align: top;
  height: 116px;
  /* margin-right: 15px; */
  transition: all 25ms ease-out;
  /* fixes a bug in ff where the animation of the chat
  * counter appears on top of our input during its transition */
  outline: 0;
  color: #000;
  opacity: 0;
  &::placeholder {
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    text-transform: none;
  }
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`

const messagesStyles = `
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1001;
  width: 100%;
  font-size: 12px;
  height: 100%;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  background: #232c3b;
`

const FeedbackInputErrorMessage = styled('div')`
  ${messagesStyles} span {
    color: red;
    margin-bottom: 20px;
  }
  a {
    color: #000;
    text-decoration: none;
  }
`

const FeedbackInputSuccessMessage = styled('div')`
  ${messagesStyles} p {
    opacity: 0;
    color: white;
    &:first-child {
      animation: ${appearToEightyAnimation} 500ms ease;
      animation-delay: 100ms;
      animation-fill-mode: forwards;
    }
    &:last-child {
      animation: ${appearToEightyAnimation} 500ms ease;
      animation-delay: 1s;
      animation-fill-mode: forwards;
    }
  }
`

const FeedbackInputControls = styled('div')`
  pointer-events: none;
  opacity: 0;
  display: flex;
  width: 100%;
  height: 44px;
  background: #232c3b;
  .emojis {
    z-index: 1002;
    margin-top: -10px;
  }
  .buttons {
    flex: 1;
    flex-grow: 0;
    align-items: center;
    transition: opacity 100ms ease;
    & > button {
      flex-grow: 0;
    }
    &.hidden {
      opacity: 0;
    }
  }
`

const FeedbackInputMain = styled('div')`
  /* padding: 0 10px; */
  position: relative;
  height: 34px;
  width: 85px;
  display: block;
  background: white;
  /* margin-right: 1rem; */
  &.focused {
    ${FeedbackInputTextarea} {
      background: #fff;
      overflow: auto;
      opacity: 1;
    }
    ${FeedbackInputControls} {
      animation-name: ${appearAnimation};
      animation-delay: 250ms;
      animation-duration: 150ms;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
      pointer-events: inherit;
      z-index: 1001;
      padding: 12px 8px 8px 8px;
    }
  }
  &.error
    ${FeedbackInputTextarea},
    &.loading
    ${FeedbackInputTextarea},
    &.success
    ${FeedbackInputTextarea} {
    pointer-events: none;
  }
  &.error ${FeedbackInputTextarea}, &.success ${FeedbackInputTextarea} {
    color: transparent;
    user-select: none;
  }
  &.loading ${FeedbackInputTextarea} {
    color: #ccc;
  }
  &.dark {
    ${FeedbackInputTextarea} {
      color: #fff;
      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }
    ${FeedbackInputErrorMessage} {
      span {
        color: #999;
      }
      a {
        color: #fff;
      }
    }
    &.focused ${FeedbackInputTextarea} {
      background: none;
    }
  }
`

const FeedbackInputEmojiSelector = styled('div')`
  display: flex;
  max-width: 210px;
  pointer-events: none;
  &.loading {
    filter: grayscale(100%);
    cursor: default;
    pointer-events: none;
    & > span {
      cursor: default;
      &:first-child {
        pointer-events: none;
      }
    }
  }
  & > span {
    display: inline-flex;
    padding: 10px 3px;
    cursor: pointer;
    &:first-child {
      padding-left: 0;
      pointer-events: all;
    }
    &:last-child {
      padding-right: 30px;
    }
    text-align: center;
    &.active,
    &:hover {
      .inner {
        border-color: #f8e71c;
      }
    }
    .inner {
      display: inline-flex;
      height: 24px;
      width: 24px;
      border-radius: 5px;
      border: 1px solid #eaeaea;
      justify-content: center;
      align-items: center;
      padding: 3px;
    }
    &.option {
      opacity: 0;
      transform: translateX(-10px);
      transition: all ease 100ms;
      pointer-events: none;
    }
  }
  &.dark {
    & > span {
      .inner {
        border-color: #000;
        background-color: #000;
      }
      &.active,
      &:hover {
        .inner {
          border-color: #f8e71c;
        }
      }
    }
    &.loading > span .inner {
      border-color: #585858;
      background-color: #585858;
    }
  }
  &.shown > span.option {
    pointer-events: all;
    opacity: 1;
    transform: translateX(0);
  }
`

class EmojiSelector extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    shown: false,
    current: null,
    currentSetAt: null,
  }

  onMouseEnter = () => {
    // eslint-disable-next-line no-console
    this.setState((prevState) => {
      if (!prevState.shown && Date.now() - prevState.currentSetAt > 100) {
        return {shown: true}
      }
    })
  }

  onMouseLeave = () => {
    // eslint-disable-next-line no-console
    this.setState((prevState) => {
      if (prevState.shown) {
        return {shown: false}
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.onShow && !prevState.shown && this.state.shown) {
      this.props.onShow()
    }

    if (this.props.onHide && prevState.shown && !this.state.shown) {
      this.props.onHide()
    }

    if (this.props.onSelect && prevState.current !== this.state.current) {
      this.props.onSelect(this.state.current)
    }
  }

  onSelect = (current) => {
    this.setState({
      current,
      currentSetAt: Date.now(),
      shown: false,
    })
  }

  render() {
    return (
      <FeedbackInputEmojiSelector
        className={`
        ${this.state.shown ? 'shown' : ''}
        ${this.props.loading ? 'loading' : ''}
        ${this.props.dark ? 'dark' : ''}
      `}
      >
        <span
          className={this.state.current !== null ? 'active' : ''}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={() => {
            if (this.state.current !== null && this.state.shown) {
              this.onSelect()
            }
          }}
        >
          <span className="inner">
            {this.state.current === null ? (
              <Ghost />
            ) : this.state.shown ? (
              <X />
            ) : (
              <Emoji code={this.state.current} />
            )}
          </span>
        </span>

        {Array.from(EMOJIS.values()).map((emoji, i) => (
          <span
            className={`option ${this.state.shown ? 'db' : 'dn'}`}
            key={i}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onSelect.bind(this, emoji)}
          >
            <span className="inner">
              <Emoji code={emoji} />
            </span>
          </span>
        ))}
      </FeedbackInputEmojiSelector>
    )
  }
}

const Emoji = ({code}) => (
  <div
    css={css`
      width: 16px;
      height: 16px;
    `}
  >
    {getEmoji(code)}
  </div>
)

const X = function X() {
  return (
    <svg
      width="8px"
      height="8px"
      viewBox="0 0 8 8"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        transform="translate(-704.000000, -190.000000) translate(704.000000, 190.000000)"
        stroke="#979797"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="square"
      >
        <path d="M.5.5l7 7" />
        <path d="M7.5.5l-7 7" />
      </g>
    </svg>
  )
}

// gets the emoji from the code
let EMOJI_CODES = null
function getEmoji(code) {
  if (code === null) return code
  if (EMOJI_CODES === null) {
    EMOJI_CODES = new Map([...EMOJIS].map(([k, v]) => [v, k]))
  }
  return EMOJI_CODES.get(code)
}

class ClickedOutside extends Component {
  static defaultProps = {
    onClickOutside: () => {},
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClickOutside()
    }
  }

  render() {
    return <div ref={this.setWrapperRef}>{this.props.children}</div>
  }
}

ClickedOutside.propTypes = {
  children: PropTypes.element.isRequired,
}

export default FeedbackInput

class FeedbackErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true}
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
