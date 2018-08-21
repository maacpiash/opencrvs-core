import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { defineMessages } from 'react-intl'

import { Box, Header } from '@opencrvs/components/lib/interface'
import { PrimaryButton } from '@opencrvs/components/lib/buttons'
import { ArrowForward } from '@opencrvs/components/lib/icons'

import styled from '../../styled-components'

import { goToTab as goToTabAction } from '../../navigation/navigationActions'
import { birthParentForm } from '../../forms/birth-parent'
import { IForm, IFormSection } from '../../forms'
import { Form, FormTabs, ViewHeaderWithTabs } from '../../components/form'

const FormAction = styled.div`
  display: flex;
  justify-content: center;
`

const FormPrimaryButton = styled(PrimaryButton)`
  box-shadow: 0 0 13px 0 rgba(0, 0, 0, 0.27);
`

export const messages = defineMessages({})

const FormContainer = styled.div`
  padding: 35px 25px;
  padding-bottom: 0;
  z-index: 1;
`

const FormViewContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`

const ViewFooter = styled(Header)`
  flex-grow: 1;
  margin-top: -50px;
  padding-top: 100px;

  ${FormPrimaryButton} {
    width: 270px;
    justify-content: center;
  }
  ${FormAction} {
    margin-bottom: 1em;
  }
`

function getActiveSectionId(form: IForm, viewParams: { tab?: string }) {
  return viewParams.tab || form.sections[0].id
}

function getNextSection(sections: IFormSection[], fromSection: IFormSection) {
  const currentIndex = sections.indexOf(fromSection)

  if (currentIndex === sections.length - 1) {
    return null
  }

  return sections[currentIndex + 1]
}

class BirthParentFormView extends React.Component<
  {
    goToTab: typeof goToTabAction
  } & RouteComponentProps<{ tab: string }>
> {
  render() {
    const { match, goToTab } = this.props

    const activeTabId = getActiveSectionId(
      birthParentForm,
      this.props.match.params
    )

    const activeSection = birthParentForm.sections.find(
      ({ id }) => id === activeTabId
    )

    if (!activeSection) {
      throw new Error(`Configuration for tab "${match.params.tab}" missing!`)
    }

    const nextTab = getNextSection(birthParentForm.sections, activeSection)

    return (
      <FormViewContainer>
        <ViewHeaderWithTabs
          breadcrump="Informant: Parent"
          title="New Birth Registration"
        >
          <FormTabs
            sections={birthParentForm.sections}
            activeTabId={activeTabId}
            onTabClick={goToTab}
          />
        </ViewHeaderWithTabs>
        <FormContainer>
          <Box>
            <Form title={activeSection.title} fields={activeSection.fields} />
            <FormAction>
              {nextTab && (
                <FormPrimaryButton
                  onClick={() => goToTab(nextTab.id)}
                  id="next_tab"
                  icon={() => <ArrowForward />}
                >
                  Next
                </FormPrimaryButton>
              )}
            </FormAction>
          </Box>
        </FormContainer>
        <ViewFooter>
          <FormAction>
            <FormPrimaryButton id="save_draft">Save draft</FormPrimaryButton>
          </FormAction>
          <FormAction>
            <FormPrimaryButton id="preview">Preview</FormPrimaryButton>
          </FormAction>
        </ViewFooter>
      </FormViewContainer>
    )
  }
}

export const BirthParentForm = connect(null, { goToTab: goToTabAction })(
  BirthParentFormView
)
