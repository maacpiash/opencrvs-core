import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { STEP_ONE_FORM } from './Constants'
import { injectIntl } from 'react-intl'
import { reduxForm } from 'redux-form'
import { IStepOne, StepOne } from './StepOne'
import { actions as loginActions } from './LoginActions'

type StateProps = Partial<IStepOne>
type DispatchProps = Partial<IStepOne>

const mapStateToProps = (store: any): StateProps => {
  const formId = STEP_ONE_FORM
  return {
    formId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  submitAction: (values: any) => dispatch(loginActions.startStepOne(values))
})

const stepOneForm = reduxForm({
  form: STEP_ONE_FORM,
  destroyOnUnmount: true
})(injectIntl(StepOne))

export const StepOneContainer = connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(stepOneForm)
