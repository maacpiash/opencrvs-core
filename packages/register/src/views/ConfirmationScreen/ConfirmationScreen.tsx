import * as React from 'react'
import { connect } from 'react-redux'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ViewHeader } from '../../components/ViewHeader'
import { Box } from '@opencrvs/components/lib/interface'
import styled from 'styled-components'
import {
  NoConnectivity,
  Rejected,
  CompleteTick
} from '@opencrvs/components/lib/icons'
import {
  ViewFooter,
  FooterAction,
  FooterPrimaryButton
} from '@opencrvs/register/src/components/interface/footer'
import { RouteComponentProps } from 'react-router'
import { IStoreState } from 'src/store'
import { IntlState } from 'src/i18n/reducer'
import { DECLARATION, REJECTION } from 'src/utils/constants'

const messages = defineMessages({
  nextCardTitle: {
    id: 'register.confirmationScreen.nextCard.title',
    defaultMessage: 'What next?',
    description:
      'The title of the what next card that appears on the saved registration page'
  },
  rejectedNoticeCardText2: {
    id: 'register.confirmationScreen.rejectedNoticeCardText2',
    defaultMessage:
      'has been rejected. The application agent will be informed about the reasons for rejection and instructed to follow up.',
    description:
      'The text of the what next card that appears on the rejected registration page'
  },
  backButton: {
    id: 'register.confirmationScreen.buttons.back',
    defaultMessage: 'Back to homescreen',
    description: 'The button to return to the homescreen'
  },
  footerActionButton: {
    id: 'register.confirmationScreen.footerActionButton',
    defaultMessage: `Back to {event, select, declaration {New Application} registration {Application} duplication {Duplication}
    certificate {Certification} offlineEvent {New Application}}`,
    description: 'The button to showed on footer section'
  },

  title: {
    id: 'register.confirmationScreen.title',
    defaultMessage: `{event, select, declaration {Application} registration {Registration} duplication {Duplication}
      certificate {Certificate} offlineEvent {Application connectivity}} {action, select, completed {completed} 
      submitted {submitted} rejected {rejected} approved {Approved} registered {registered} offlineAction {pending}}`,
    description: 'The title that appear on the confirmation screen '
  },
  headerDesc: {
    id: 'register.confirmationScreen.headerDesc',
    defaultMessage: `{event, select, declaration {The application} registration {} duplication {} certificate {} offlineEvent {The application}} 
      {action, select, submitted {is now on its way for validation} completed {} registered {registered} rejected {rejected} approved {Approved}
      offlineAction {will automatically be sent out for validation once your device has internet connectivity}}`,
    description:
      'The Header description that appear on the confirmation screen '
  },
  boxHeaderTitle: {
    id: 'register.confirmationScreen.boxHeaderTitle',
    defaultMessage: `{action, select, completed {All Done} submitted {All Done} rejected {Application rejected} registered {Application registered}
      approved {Application approved} offlineAction {Almost there}}`,
    description: 'The box header title that appear on the confirmation screen '
  },
  boxHeaderDesc: {
    id: 'register.confirmationScreen.boxHeaderDesc',
    defaultMessage: `{event, select, declaration {The birth application of {fullName}} registration {The birth of {fullName}} duplication 
      {The birth duplication of {fullName}} certificate {The birth certificate of {fullName}} offlineEvent {The birth application of 
      {fullName}}} {action, select, completed {has been completed.} submitted {has been submitted.} rejected {has been rejected.} registered {has been registered}
      approved {has been approved.} offlineAction {is pending due to internet connection.}}`,
    description:
      'The box header description that appear on the confirmation screen '
  },
  trackingSectionTitle: {
    id: 'register.confirmationScreen.trackingSectionTitle',
    defaultMessage: `{event, select, declaration {Tracking ID number: } registration {Birth Registration Number: } 
    duplication {duplication} certificate {...} offlineEvent {pending}}`,
    description:
      'The tracking section title that appear on the confirmation screen'
  },
  trackingSectionDesc: {
    id: 'register.confirmationScreen.trackingSectionDesc',
    defaultMessage: `{event, select, declaration {The informant will receive this number via SMS, 
      but make sure they write it down and keep it safe. They should use the number as a reference if enquiring 
      about their registration.} registration-registered {The informant will receive this number via SMS with instructions 
      on how and where to collect the certificate. They should use the number as a reference if enquiring about their 
      registration.} registration {} duplication{} certificate {Certificates have been collected from your jurisdiction.} 
      offlineEvent {}}`,
    description:
      'The tracking section description that appear on the confirmation screen'
  },
  nextSectionDesc: {
    id: 'register.confirmationScreen.nextSectionDesc',
    defaultMessage: `{event, select, declaration {You will be notified through OpenCRVS when registration is complete 
      or if there are any delays in the process.} registration {The registration process is complete.} duplication {}
      certificate {} offlineEvent {All you need to do is login once you have internet connectivity on your device within 
      the next 7 days. OpenCRVS will automatically submit the form, so you won’t need to do anything else.}}`,
    description:
      'The next section description that appear on the confirmation screen'
  },
  nextSectionDescDetails: {
    id: 'register.confirmationScreen.nextSectionDescDetails',
    defaultMessage: `{event, select, declaration {The informant will receive this number via SMS, but make sure they write it down and keep it safe. They should use the number as a reference if enquiring about their registration.} 
      registration {The informant will receive this number via SMS with instructions on how and where to collect the certificate. They should use the number as a reference if enquiring about their registration.} 
      duplication{} certificate {Certificates have been collected from your jurisdiction.} 
      offlineEvent {wait for internet connection}}`,
    description:
      'The next section description details that appear on the confirmation screen'
  }
})

const Container = styled.div`
  z-index: 1;
  width: 80%;
  margin: 0 auto;
  margin-top: -55px;
  max-width: 940px;
`
const StyledP = styled.p`
  color: ${({ theme }) => theme.colors.copy};
  font-family: ${({ theme }) => theme.fonts.regularFont};
  width: 450px;
  margin: 0 auto;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    width: 100%;
  }
`
const SubmissionText = styled(StyledP)`
  text-align: center;
  margin-top: 15px;
`
const TrackingBox = styled(Box)`
  background: linear-gradient(
    137.89deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.accentLight} 100%
  );
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  margin: 15px 0;

  /* stylelint-disable */
  ${StyledP} {
    /* stylelint-enable */
    color: ${({ theme }) => theme.colors.white};
  }
`
const NextBox = styled(Box)`
  text-align: center;
  padding-bottom: 40px;
`

const BoxHeader = styled.h2`
  color: ${({ theme }) => theme.colors.copy};
  font-family: ${({ theme }) => theme.fonts.lightFont};
  font-size: 24px;
  font-weight: 300;
  line-height: 33px;
`

const ImgHeaderContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  h2 {
    padding-left: 10px;
    margin-top: 13px;
  }
  justify-content: center;
`

const TrackingHeader = styled.h3`
  font-family: ${({ theme }) => theme.fonts.regularFont};
  font-size: 18px;
`

const TrackingNumber = styled.h1`
  font-family: ${({ theme }) => theme.fonts.lightFont};
  font-size: 30px;
  margin-top: -15px;
`

const Footer = styled(ViewFooter)`
  z-index: 0;
`

const Header = styled(ViewHeader)`
  width: 80%;
  margin: 0 auto;
  box-shadow: none;
  background: none;
  #view_title {
    margin-bottom: 30px;
  }
`

const HeaderWrapper = styled.div`
  background: linear-gradient(
    270deg,
    ${({ theme }) => theme.colors.headerGradientLight} 0%,
    ${({ theme }) => theme.colors.headerGradientDark} 100%
  );
`

type Props = {
  language: IntlState['language']
}

class ConfirmationScreenView extends React.Component<
  Props & InjectedIntlProps & RouteComponentProps<{}>
> {
  render() {
    const { intl, history, location } = this.props
    const online = navigator.onLine
    const language = this.props.language
    const fullNameInBn = location.state.fullNameInBn
      ? location.state.fullNameInBn
      : ''
    const fullNameInEng = location.state.fullNameInEng
      ? location.state.fullNameInEng
      : ''
    const eventName = online ? location.state.eventName : 'offlineEvent'
    const actionName = online ? location.state.actionName : 'offlineAction'
    const title = intl.formatMessage(messages.title, {
      event: eventName,
      action: actionName
    })
    const headerDesc = intl.formatMessage(messages.headerDesc, {
      event: eventName,
      action: actionName
    })
    const isRejection = actionName === REJECTION ? true : false
    const fullName = language === 'en' ? fullNameInEng : fullNameInBn
    const boxHeaderDesc = intl.formatMessage(messages.boxHeaderDesc, {
      event: eventName,
      action: actionName,
      fullName
    })
    const trackNumber = location.state.trackNumber
      ? location.state.trackNumber
      : ''
    const trackingCardTitle = intl.formatMessage(
      messages.trackingSectionTitle,
      {
        event: eventName
      }
    )
    const trackingCardDesc = intl.formatMessage(messages.trackingSectionDesc, {
      event: eventName
    })
    const nextCardText1 = intl.formatMessage(messages.nextSectionDesc, {
      event: eventName
    })
    const nextCardText2 = intl.formatMessage(messages.nextSectionDescDetails, {
      event: eventName
    })
    const isDeclaration =
      location.state.eventName === DECLARATION ? true : false
    const isTrackingSection = location.state.trackingSection ? true : false
    const isNextSection = location.state.nextSection ? true : false
    const footerButtonText = intl.formatMessage(messages.footerActionButton, {
      event: eventName
    })

    return (
      <>
        <HeaderWrapper>
          <Header
            title={title}
            description={headerDesc}
            hideBackButton={!isDeclaration}
            id="confirmation_screen_view"
          />
        </HeaderWrapper>
        <Container>
          <Box>
            <ImgHeaderContainer>
              {isRejection ? (
                <Rejected />
              ) : !online ? (
                <NoConnectivity />
              ) : (
                <CompleteTick />
              )}
              <BoxHeader id="submission_title">
                {intl.formatMessage(messages.boxHeaderTitle, {
                  action: actionName
                })}
              </BoxHeader>
            </ImgHeaderContainer>
            <SubmissionText id="submission_text">
              {<span>{boxHeaderDesc}</span>}
            </SubmissionText>
          </Box>
          {isTrackingSection && (
            <TrackingBox>
              <TrackingHeader>{trackingCardTitle}</TrackingHeader>
              <TrackingNumber id="trackingIdViewer">
                {trackNumber}
              </TrackingNumber>
              <StyledP>{trackingCardDesc}</StyledP>
            </TrackingBox>
          )}
          {isNextSection && (
            <NextBox>
              <BoxHeader>
                {intl.formatMessage(messages.nextCardTitle)}
              </BoxHeader>
              <StyledP id="whats_next_title">{nextCardText1}</StyledP>
              <StyledP id="whats_next_text">{nextCardText2}</StyledP>
            </NextBox>
          )}
        </Container>
        <Footer>
          {!isRejection && (
            <FooterAction>
              <FooterPrimaryButton onClick={() => history.push('/')}>
                {footerButtonText}
              </FooterPrimaryButton>
            </FooterAction>
          )}
          <FooterAction>
            <FooterPrimaryButton onClick={() => history.push('/')}>
              {intl.formatMessage(messages.backButton)}
            </FooterPrimaryButton>
          </FooterAction>
        </Footer>
      </>
    )
  }
}

export const ConfirmationScreen = injectIntl(
  connect((state: IStoreState) => ({
    language: state.i18n.language
  }))(ConfirmationScreenView)
)
