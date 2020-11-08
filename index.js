addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
//Links data
const data = [
  {
    name: 'GitHub',
    url: 'https://github.com/deependra227',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/deependra-chansoliya/',
  },
  {
    name: 'Resume',
    url: 'https://deependra227.github.io',
  },
]
async function handleRequest(request) {
  let url = new URL(request.url)
  //routing
  if (url.pathname == '/links') {
    const json = JSON.stringify(data, null, 2)
    return new Response(json, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  } else {
    //static page url
    const url = 'https://static-links-page.signalnerve.workers.dev'
    //Fetching static page
    const HTMLres = await fetch(url)

    return new HTMLRewriter()
      .on('div#links', new LinksTransformer(data)) // inserting links
      .on('div#social', new SocialTransformer()) // inserting soical icons/links
      .on('div#profile', {
        element: element => {
          element.removeAttribute('style') // removing display none
        },
      })
      .on('img#avatar', {
        element: element => {
          element.setAttribute(
            'src',
            'https://deependra227.github.io/assets/img/index.png',
          ) // inserting photo
        },
      })
      .on('h1#name', {
        element: element => {
          element.setInnerContent('Deependra Chansoliya') // Inserting name
        },
      })
      .on('title', {
        element: element => {
          element.setInnerContent('Deependra Chansoliya') // inserting tile
        },
      })
      .on('body', {
        element: element => {
          element.setAttribute('class', 'bg-blue-900') //changing background color
        },
      })
      .transform(HTMLres)
  }
}
class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    this.links.forEach(link => {
      element.append(`<a href="${link.url}" target="_blank">${link.name}</a>`, {
        html: true,
      })
    })
  }
}

class SocialTransformer {
  constructor() {
    this.socials = [
      {
        url: 'https://github.com/deependra227',
        icon: 'https://www.flaticon.com/svg/static/icons/svg/270/270798.svg',
      },
      {
        url: 'https://www.linkedin.com/in/deependra-chansoliya/',
        icon:
          'https://www.flaticon.com/premium-icon/icons/svg/3256/3256016.svg',
      },
      {
        url: 'https://deependra227.github.io',
        icon:
          'https://www.flaticon.com/premium-icon/icons/svg/3518/3518229.svg',
      },
    ]
  }

  async element(element) {
    element.removeAttribute('style')
    this.socials.forEach(social => {
      element.append(
        `<a href="${social.url}" target="_blank"><img src="${social.icon}"/></a>`,
        {
          html: true,
        },
      )
    })
  }
}
