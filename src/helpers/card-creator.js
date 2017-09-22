

const createArtistCard = ({ name, imageUrl, displayText   }) => {
  const card = {
        'contentType': 'application/vnd.microsoft.card.adaptive',
        'content': {
            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
            'type':  'AdaptiveCard',
            'version': "1.0",
            'body': [
                {
                    'type': 'Container',
                    'items': [
                        {
                            'type': 'ColumnSet',
                            'columns': [
                                {
                                    'type': 'Column',
                                    'size': 'auto',
                                    'items': [
                                        {
                                            'type': 'Image',
                                            'url': imageUrl,
                                            'size': 'medium',
                                            'style': 'person'
                                        }
                                    ]
                                },
                                {
                                    'type': 'Column',
                                    'size': 'stretch',
                                    'items': [
                                        {
                                            'type': 'TextBlock',
                                            'text': `The great sage ${name} says`,
                                            'weight': 'bolder',
                                            'size': 'extraLarge',
                                            'separation': 'strong'
                                        },
                                        {
                                            'type': 'TextBlock',
                                            'text': displayText,
                                            'wrap': true,
                                            'size': 'medium'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    return card;

}

exports.createArtistCard = createArtistCard
