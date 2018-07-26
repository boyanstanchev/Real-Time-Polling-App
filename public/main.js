const form = $('#vote-form')

form.on('submit', (e) => {
    const choice = $('input:radio[name="os"]:checked').val()
    const data = {os: choice}

    $.ajax({
        type: "POST",
        url: 'https://os-voting.herokuapp.com/poll',
        data: data,
        dataType: 'application/json'
    })


    e.preventDefault()
})

fetch('https://os-voting.herokuapp.com/poll').then(res => res.json())
    .then(data => {
        const votes = data.votes
        const totalVotes = votes.length

        const voteCounts = votes.reduce((acc, vote) =>
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points), acc))


        let dataPoints = [
            {label: 'Windows', y: voteCounts.Windows},
            {label: 'MacOS', y: voteCounts.MacOS},
            {label: 'Linux', y: voteCounts.Linux},
            {label: 'Other', y: voteCounts.Other},
        ]

        const chartContainer = $('#chartContainer')
        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme4',
                title: {
                    text: `Total Votes: ${totalVotes}`
                },
                data: [{
                    type: 'column',
                    dataPoints: dataPoints
                }]
            })

            chart.render()

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = false;

            let pusher = new Pusher('8aba2941a0d822254a2a', {
                cluster: 'eu',
                encrypted: true
            });

            let channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function (data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label === data.os) {
                        x.y += data.points
                        return x
                    } else {
                        return x
                    }
                })
                chart.render()
            })
        }
    })

