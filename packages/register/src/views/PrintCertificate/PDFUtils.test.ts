import {
  printMoneyReceipt,
  previewCertificate,
  printCertificate
} from '@register/views/PrintCertificate/PDFUtils'
import {
  mockApplicationData,
  userDetails,
  mockDeathApplicationData,
  mockOfflineData
} from '@register/tests/util'
import { createIntl } from 'react-intl'
import { Event } from '@register/forms'
import { omit, cloneDeep } from 'lodash'

const intl = createIntl({
  locale: 'en'
})

describe('PDFUtils related tests', () => {
  it('Print from money receipt template for birth event', () => {
    expect(() =>
      printMoneyReceipt(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: mockApplicationData,
          event: Event.BIRTH
        },
        userDetails,
        mockOfflineData
      )
    ).not.toThrowError()
  })
  it('Print from money receipt template for death event', () => {
    expect(() =>
      printMoneyReceipt(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: mockDeathApplicationData,
          event: Event.DEATH
        },
        userDetails,
        mockOfflineData
      )
    ).not.toThrowError()
  })
  it('Print money reciept function will throws exception if invalid userDetails found', () => {
    const deathApplication = omit(mockDeathApplicationData, 'deathEvent')
    expect(() =>
      printMoneyReceipt(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: deathApplication,
          event: Event.DEATH
        },
        null,
        mockOfflineData
      )
    ).toThrowError('No user details found')
  })
  it('Print money reciept function will throws exception if receipt template is not present', () => {
    const faultyOfflineData = cloneDeep(mockOfflineData)
    faultyOfflineData.templates.receipt = null
    expect(() =>
      printMoneyReceipt(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: mockDeathApplicationData,
          event: Event.DEATH
        },
        userDetails,
        faultyOfflineData
      )
    ).toThrowError('Money reciept template is misssing in offline data')
  })
  it('Throws exception if invalid key is provided', () => {
    const deathApplication = omit(mockDeathApplicationData, 'deathEvent')
    expect(() =>
      printCertificate(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: deathApplication,
          event: Event.DEATH
        },
        userDetails,
        mockOfflineData
      )
    ).toThrowError(
      'Given value key structure is not valid: deathEvent.deathDate'
    )
  })
  it('Throws exception if invalid userDetails found for printCertificate', () => {
    const deathApplication = omit(mockDeathApplicationData, 'deathEvent')
    expect(() =>
      printCertificate(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: deathApplication,
          event: Event.DEATH
        },
        null,
        mockOfflineData
      )
    ).toThrowError('No user details found')
  })
  it('Throws exception if invalid userDetails found for previewCertificate', () => {
    const deathApplication = omit(mockDeathApplicationData, 'deathEvent')
    expect(
      previewCertificate(
        intl,
        {
          id: 'asdhdqe2472487jsdfsdf',
          data: deathApplication,
          event: Event.DEATH
        },
        null,
        mockOfflineData,
        (pdf: string) => {}
      )
    ).rejects.toThrowError('No user details found')
  })
})
