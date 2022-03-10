import {AccessControl} from 'accesscontrol'

export const accessControl = new AccessControl()

export const allRoles = [
  'user',
  'pro',
  'instructor',
  'editor',
  'admin',
  'publisher',
  'editor',
  'instructor',
  'reviewer',
  'advocate',
]

accessControl.grant('user')
accessControl.grant('pro').extend('user')
accessControl.grant(['editor', 'reviewer']).extend('pro')
accessControl.grant(['advocate']).extend('reviewer')
accessControl.grant(['instructor']).extend('pro')
accessControl.grant('publisher').extend(['editor', 'instructor'])
accessControl.grant('admin').extend(['editor', 'instructor', 'publisher'])

accessControl.grant('admin').createOwn('video')

accessControl.lock()
