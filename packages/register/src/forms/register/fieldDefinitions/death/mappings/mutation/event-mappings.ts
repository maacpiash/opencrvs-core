import { IFormField, IFormData } from 'src/forms'

export const deceasedDateTransformation = (alternativeSectionId?: string) => (
  transformedData: any,
  draftData: IFormData,
  sectionId: string,
  field: IFormField
) => {
  if (!draftData[sectionId] || !draftData[sectionId][field.name]) {
    return transformedData
  }
  transformedData[
    alternativeSectionId ? alternativeSectionId : sectionId
  ].deceased = {
    deceased: false,
    deathDate: draftData[sectionId][field.name]
  }
  return transformedData
}

export const eventLocationMutationTransformer = (
  lineNumber: number = 0,
  transformedFieldName?: string
) => (
  transformedData: any,
  draftData: IFormData,
  sectionId: string,
  field: IFormField
) => {
  if (!transformedData.eventLocation) {
    transformedData.eventLocation = {
      address: {
        country: '',
        state: '',
        district: '',
        postalCode: '',
        line: ['', '', '', '', '', '']
      }
    } as fhir.Location
  }
  if (lineNumber > 0) {
    transformedData.eventLocation.address.line[lineNumber - 1] =
      draftData[sectionId][field.name]
  } else if (field.name === 'placeOfDeath') {
    transformedData.eventLocation.type = draftData[sectionId][field.name]
  } else if (field.name === 'deathLocation') {
    transformedData.eventLocation._fhirID = draftData[sectionId][field.name]
    if (transformedData.eventLocation.address) {
      delete transformedData.eventLocation.address
    }
    if (transformedData.eventLocation.type) {
      delete transformedData.eventLocation.type
    }
  } else {
    transformedData.eventLocation.address[field.name] =
      draftData[sectionId][field.name]
  }
  if (field.name === 'addressLine4') {
    transformedData.eventLocation.partOf = `Location/${
      draftData[sectionId][field.name]
    }`
  }

  return transformedData
}