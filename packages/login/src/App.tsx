import * as React from 'react'
import { Provider } from 'react-redux'
import { IntlContainer } from './i18n/IntlContainer'
import { ConnectedRouter } from 'react-router-redux'
import { store, history } from './store'
import { Route } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { config } from './config'
import { StepTwo } from './login/StepTwo'
import { getTheme } from '@opencrvs/components/lib/theme'
import { StepOneContainer } from './login/StepOneContainer'
import { PageContainer } from './common/PageContainer'

export class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <IntlContainer>
          <ThemeProvider theme={getTheme(config.LOCALE)}>
            <ConnectedRouter history={history}>
              <PageContainer>
                <Route exact path="/" component={StepOneContainer} />
                <Route exact path="/smscode" component={StepTwo} />
              </PageContainer>
            </ConnectedRouter>
          </ThemeProvider>
        </IntlContainer>
      </Provider>
    )
  }
}
