import {
  FiBookOpen,
  FiClipboard,
  FiClock,
  FiGithub,
  FiHardDrive,
  FiList,
  FiUsers
} from 'react-icons/fi'

export const navigationGroupsList = [
  {
    groupName: 'Multidados',
    options: [
      { url: '/', text: 'Marcações', icon: FiClock },
      { url: '/projects', text: 'Projetos', icon: FiClipboard },
      { url: '/customers', text: 'Clientes', icon: FiUsers }
    ]
  },
  {
    groupName: 'Github',
    options: [
      { url: 'https://github.com/codeby-global', text: 'Organização', icon: FiGithub },
      { url: 'https://forum.codeby.world/', text: 'Forum', icon: FiUsers }
    ]
  },
  {
    groupName: 'Ferramentas',
    options: [
      {
        url: 'https://codeby-global.atlassian.net/jira/your-work',
        text: 'Jira',
        icon: FiBookOpen
      },
      {
        url: 'https://drive.google.com/drive/u/0/folders/1e9WrV4z47QyKgM1muMWNBZRQ4QYsp6XG',
        text: 'Google Drive',
        icon: FiHardDrive
      },
      {
        url: 'https://docs.google.com/document/d/1FwB5woFRf0usq28KW1nJOvojts33SrPmWeDG8rOig3w/edit',
        text: 'Admin List',
        icon: FiList
      }
    ]
  }
]
