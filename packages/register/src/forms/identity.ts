import { defineMessages } from 'react-intl'
import { NUMBER, TEXT, IDynamicFieldTypeMapper } from '.'

const NATIONAL_ID = 'NATIONAL_ID'
const BIRTH_REGISTRATION_NUMBER = 'BIRTH_REGISTRATION_NUMBER'
const PASSPORT = 'PASSPORT'
const DEATH_REGISTRATION_NUMBER = 'DEATH_REGISTRATION_NUMBER'
const OTHER = 'OTHER'

export const messages = defineMessages({
  iDType: {
    id: 'formFields.iDType',
    defaultMessage: 'Type of ID',
    description: 'Label for form field: Type of ID'
  },
  iDTypePassport: {
    id: 'formFields.iDTypePassport',
    defaultMessage: 'Passport',
    description: 'Option for form field: Type of ID'
  },
  iDTypeNationalID: {
    id: 'formFields.iDTypeNationalID',
    defaultMessage: 'National ID',
    description: 'Option for form field: Type of ID'
  },
  iDTypeDrivingLicence: {
    id: 'formFields.iDTypeDrivingLicence',
    defaultMessage: 'Drivers Licence',
    description: 'Option for form field: Type of ID'
  },
  iDTypeBRN: {
    id: 'formFields.iDTypeBRN',
    defaultMessage: 'Birth Registration Number',
    description: 'Option for form field: Type of ID'
  },
  iDTypeDRN: {
    id: 'formFields.iDTypeDRN',
    defaultMessage: 'Death Registration Number',
    description: 'Option for form field: Type of ID'
  },
  iDTypeRefugeeNumber: {
    id: 'formFields.iDTypeRefugeeNumber',
    defaultMessage: 'Refugee Number',
    description: 'Option for form field: Type of ID'
  },
  iDTypeAlienNumber: {
    id: 'formFields.iDTypeAlienNumber',
    defaultMessage: 'Alien Number',
    description: 'Option for form field: Type of ID'
  },
  iDTypeOther: {
    id: 'formFields.iDTypeOther',
    defaultMessage: 'Other',
    description: 'Option for form field: Type of ID'
  },
  iDTypeOtherLabel: {
    id: 'formFields.iDTypeOtherLabel',
    defaultMessage: 'Other type of ID',
    description: 'Label for form field: Other type of ID'
  },
  iD: {
    id: 'formFields.iD',
    defaultMessage: 'ID Number',
    description: 'Label for form field: ID Number'
  }
})

export const identityOptions = [
  { value: NATIONAL_ID, label: messages.iDTypeNationalID },
  {
    value: BIRTH_REGISTRATION_NUMBER,
    label: messages.iDTypeBRN
  },
  { value: PASSPORT, label: messages.iDTypePassport },
  {
    value: DEATH_REGISTRATION_NUMBER,
    label: messages.iDTypeDRN
  },
  { value: OTHER, label: messages.iDTypeOther }
]

export const identityTypeMapper: IDynamicFieldTypeMapper = (key: string) => {
  switch (key) {
    case NATIONAL_ID:
      return NUMBER
    default:
      return TEXT
  }
}
