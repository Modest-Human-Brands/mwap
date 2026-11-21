import { developerTemplates } from './developer'
import { modelTemplates } from './model'
import { photographerTemplates } from './photographer'
import { psychiatristTemplates } from './psychiatrist'

// Every template is a portfolio; one folder per profession
export const portfolioTemplates = [...modelTemplates, ...psychiatristTemplates, ...developerTemplates, ...photographerTemplates]
