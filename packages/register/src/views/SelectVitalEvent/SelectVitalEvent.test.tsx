import {
  createTestApp,
  mockOfflineData,
  assign,
  validToken,
  getItem,
  flushPromises,
  setItem
} from 'src/tests/util'
import { SELECT_VITAL_EVENT } from 'src/navigation/routes'
import { ReactWrapper } from 'enzyme'
import { History } from 'history'
import { Store } from 'redux'
import { getOfflineDataSuccess } from 'src/offline/actions'
import * as fetch from 'jest-fetch-mock'
import { storage } from 'src/storage'
import * as CommonUtils from 'src/utils/commonUtils'

storage.getItem = jest.fn()
storage.setItem = jest.fn()
jest.spyOn(CommonUtils, 'isMobileDevice').mockReturnValue(true)

beforeEach(() => {
  history.replaceState({}, '', '/')
  assign.mockClear()
  const indexedDB = {
    USER_DETAILS: JSON.stringify({ userMgntUserID: 'shakib75' }),
    USER_DATA: JSON.stringify([
      {
        userID: 'shakib75',
        userPIN: '$2a$10$nD0E23/QJK0tjbPN23zg1u7rYnhsm8Y5/08.H20SSdqLVyuwFtVsG',
        drafts: []
      }
    ]),
    screenLock: undefined,
    USER_ID: 'shakib75'
  }

  storage.getItem = jest.fn(async (key: string) =>
    Promise.resolve(indexedDB[key])
  )
  storage.setItem = jest.fn(
    async (key: string, value: string) => (indexedDB[key] = value)
  )
})

describe('when user is selecting the vital event', () => {
  let app: ReactWrapper
  let history: History
  let store: Store

  beforeEach(async () => {
    getItem.mockReturnValue(validToken)
    setItem.mockClear()
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify({ data: mockOfflineData.locations }), { status: 200 }],
      [JSON.stringify({ data: mockOfflineData.facilities }), { status: 200 }]
    )
    const testApp = createTestApp()
    app = testApp.app
    await flushPromises()
    app.update()
    history = testApp.history
    store = testApp.store
    store.dispatch(getOfflineDataSuccess(JSON.stringify(mockOfflineData)))
  })

  describe('when user is in vital event selection view', () => {
    beforeEach(async () => {
      history.replace(SELECT_VITAL_EVENT)
      await flushPromises()
      app.update()
      app
        .find('#createPinBtn')
        .hostNodes()
        .simulate('click')
      await flushPromises()
      app.update()
      Array.apply(null, { length: 8 }).map(() => {
        app
          .find('#keypad-1')
          .hostNodes()
          .simulate('click')
      })
      await flushPromises()
      app.update()
    })
    it('lists the options', () => {
      expect(app.find('button#select_birth_event')).toHaveLength(1)
    })
    describe('when selects "Birth"', () => {
      beforeEach(() => {
        app
          .find('#select_birth_event')
          .hostNodes()
          .simulate('click')
      })
      it('takes user to the informant selection view', () => {
        expect(app.find('#select_informant_view').hostNodes()).toHaveLength(1)
      })
    })

    describe('when selects "Death"', () => {
      beforeEach(() => {
        app
          .find('#select_death_event')
          .hostNodes()
          .simulate('click')
      })
      it('takses user to the death registration form', () => {
        expect(history.location.pathname).toContain('events/death')
      })
    })
  })
})
