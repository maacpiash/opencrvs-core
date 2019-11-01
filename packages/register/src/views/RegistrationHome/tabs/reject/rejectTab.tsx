import {
  ColumnContentAlignment,
  GridTable,
  IAction
} from '@opencrvs/components/lib/interface'
import { HomeContent } from '@opencrvs/components/lib/layout'
import { GQLEventSearchResultSet } from '@opencrvs/gateway/src/graphql/schema'
import {
  goToPage,
  goToReviewDuplicate,
  goToApplicationDetails
} from '@register/navigation'
import { REVIEW_EVENT_PARENT_FORM_PAGE } from '@register/navigation/routes'
import { getScope } from '@register/profile/profileSelectors'
import { transformData } from '@register/search/transformer'
import { IStoreState } from '@register/store'
import { ITheme } from '@register/styledComponents'
import { Scope } from '@register/utils/authUtils'
import moment from 'moment'
import * as React from 'react'
import { WrappedComponentProps as IntlShapeProps, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { RowHistoryView } from '@register/views/RegistrationHome/RowHistoryView'
import { buttonMessages, constantsMessages } from '@register/i18n/messages'
import { messages } from '@register/i18n/messages/views/registrarHome'
import { IApplication, DOWNLOAD_STATUS } from '@register/applications'
import { Download } from '@opencrvs/components/lib/icons'
import { Action, Event } from '@register/forms'

interface IBaseRejectTabProps {
  theme: ITheme
  scope: Scope | null
  goToPage: typeof goToPage
  goToReviewDuplicate: typeof goToReviewDuplicate
  registrarLocationId: string | null
  goToApplicationDetails: typeof goToApplicationDetails
  outboxApplications: IApplication[]
  queryData: {
    data: GQLEventSearchResultSet
  }
  page: number
  onPageChange: (newPageNumber: number) => void
  onDownloadApplication: (
    event: Event,
    compositionId: string,
    action: Action
  ) => void
}

interface IRejectTabState {
  width: number
}

type IRejectTabProps = IntlShapeProps & IBaseRejectTabProps

class RejectTabComponent extends React.Component<
  IRejectTabProps,
  IRejectTabState
> {
  pageSize = 10
  constructor(props: IRejectTabProps) {
    super(props)
    this.state = {
      width: window.innerWidth
    }
  }

  userHasRegisterScope() {
    return this.props.scope && this.props.scope.includes('register')
  }

  componentDidMount() {
    window.addEventListener('resize', this.recordWindowWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recordWindowWidth)
  }

  recordWindowWidth = () => {
    this.setState({ width: window.innerWidth })
  }

  getExpandable = () => {
    return this.state.width > this.props.theme.grid.breakpoints.lg
      ? true
      : false
  }

  getColumns = () => {
    if (this.state.width > this.props.theme.grid.breakpoints.lg) {
      return [
        {
          label: this.props.intl.formatMessage(constantsMessages.type),
          width: 14,
          key: 'event'
        },
        {
          label: this.props.intl.formatMessage(constantsMessages.name),
          width: 23,
          key: 'name'
        },
        {
          label: this.props.intl.formatMessage(
            constantsMessages.applicantContactNumber
          ),
          width: 21,
          key: 'contactNumber'
        },
        {
          label: this.props.intl.formatMessage(constantsMessages.sentOn),
          width: 22,
          key: 'dateOfRejection'
        },
        {
          label: this.props.intl.formatMessage(messages.listItemAction),
          width: 20,
          key: 'actions',
          isActionColumn: true,
          alignment: ColumnContentAlignment.CENTER
        }
      ]
    } else {
      return [
        {
          label: this.props.intl.formatMessage(constantsMessages.type),
          width: 30,
          key: 'event'
        },
        {
          label: this.props.intl.formatMessage(constantsMessages.name),
          width: 70,
          key: 'name'
        }
      ]
    }
  }

  transformRejectedContent = (data: GQLEventSearchResultSet) => {
    if (!data || !data.results) {
      return []
    }
    const transformedData = transformData(data, this.props.intl)
    return transformedData.map(reg => {
      const actions = [] as IAction[]
      const foundApplication = this.props.outboxApplications.find(
        application => application.id === reg.id
      )
      const downloadStatus =
        (foundApplication && foundApplication.downloadStatus) || undefined

      if (downloadStatus !== DOWNLOAD_STATUS.DOWNLOADED) {
        actions.push({
          label: '',
          icon: () => <Download />,
          handler: () => {
            this.props.onDownloadApplication(
              (reg.event as unknown) as Event,
              reg.id,
              Action.LOAD_REVIEW_APPLICATION
            )
          },
          loading:
            downloadStatus === DOWNLOAD_STATUS.DOWNLOADING ||
            downloadStatus === DOWNLOAD_STATUS.READY_TO_DOWNLOAD,
          error:
            downloadStatus === DOWNLOAD_STATUS.FAILED ||
            downloadStatus === DOWNLOAD_STATUS.FAILED_NETWORK,
          loadingLabel: this.props.intl.formatMessage(
            constantsMessages.downloading
          )
        })
      } else {
        if (this.userHasRegisterScope()) {
          if (reg.duplicates && reg.duplicates.length > 0) {
            actions.push({
              label: this.props.intl.formatMessage(constantsMessages.review),
              handler: () => this.props.goToReviewDuplicate(reg.id)
            })
          } else {
            actions.push({
              label: this.props.intl.formatMessage(buttonMessages.update),
              handler: () =>
                this.props.goToPage(
                  REVIEW_EVENT_PARENT_FORM_PAGE,
                  reg.id,
                  'review',
                  reg.event ? reg.event.toLowerCase() : ''
                )
            })
          }
        }
      }

      return {
        ...reg,
        dateOfRejection:
          (reg.modifiedAt &&
            moment(
              moment(reg.modifiedAt, 'x').format('YYYY-MM-DD HH:mm:ss'),
              'YYYY-MM-DD HH:mm:ss'
            ).fromNow()) ||
          '',
        actions,
        rowClickHandler: [
          {
            label: 'rowClickHandler',
            handler: () => this.props.goToApplicationDetails(reg.id)
          }
        ]
      }
    })
  }

  renderExpandedComponent = (itemId: string) => {
    return <RowHistoryView eventId={itemId} />
  }

  render() {
    const { intl, queryData, page, onPageChange } = this.props
    const { data } = queryData

    return (
      <HomeContent>
        <GridTable
          content={this.transformRejectedContent(data)}
          columns={this.getColumns()}
          renderExpandedComponent={this.renderExpandedComponent}
          noResultText={intl.formatMessage(constantsMessages.noResults)}
          onPageChange={onPageChange}
          pageSize={this.pageSize}
          totalItems={(data && data.totalItems) || 0}
          currentPage={page}
          expandable={this.getExpandable()}
          clickable={!this.getExpandable()}
        />
      </HomeContent>
    )
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    scope: getScope(state),
    outboxApplications: state.applicationsState.applications
  }
}

export const RejectTab = connect(
  mapStateToProps,
  {
    goToPage,
    goToReviewDuplicate,
    goToApplicationDetails
  }
)(injectIntl(withTheme(RejectTabComponent)))
