const discord = require('discord.js')
const client = new discord.Client()
const config = require('./config.json')
const space = '	⁣'
const warnedUsers = new Map()

client.on('ready', () => {
    console.log(`Bot logged in as:\t${client.user.tag}`)
    client.user.setActivity('streampy.nl', { type: 'PLAYING' })
        .then(presence => console.log(`Activity set to:\t${presence.game ? presence.game.name : 'none'}`))
})

client.on('guildMemberAdd', member => {
    if (member.roles.has(member.guild.roles.find(role => role.name.toLowerCase().match(/verified/))).id) {
        var channel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/welcome/))
        var logchannel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
        logchannel.send({
            "embed": {
                "title": "Join",
                "description": "A user joined.",
                "color": 1409939,
                "fields": [
                    {
                        "name": "Name",
                        "value": `${member.user.tag}`,
                        "inline": true
                    },
                    {
                        "name": "Id",
                        "value": `${member.user.id}`,
                        "inline": true
                    },
                    {
                        "name": "Time",
                        "value": `${new Date()}`,
                        "inline": true
                    }
                ],
                "thumbnail": {
                    "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                },
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        })
        channel.send({
            "embed": {
                "title": "🇳🇱 Welkom",
                "description": `Welkom **<@${member.user.id}>** op de officiële discord server van streampyhosting. Als u vragen heeft contacteer dan een van onze medewerkers.`,
                "color": 1409939,
                "thumbnail": {
                    "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                },
                "fields": [{
                    "name": "🇺🇸 Welcome",
                    "value": `Welcome **<@${member.user.id}>** on the offcial discord server of Streampy Hosting. If you have any questions, please ask anyone of our staff.`
                }],
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        })
    } else {
        client.guilds.get(member.guild.id).createChannel(`Verify_${member.user.id}`, 'text', [{
            id: member.guild.id,
            deny: [
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'ATTACH_FILES',
                'ADD_REACTIONS',
                'EMBED_LINKS',
                'READ_MESSAGE_HISTORY',
                'USE_EXTERNAL_EMOJIS'
            ]
        }, {
            id: member.user.id,
            allow: [
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'ATTACH_FILES',
                'ADD_REACTIONS',
                'EMBED_LINKS',
                'READ_MESSAGE_HISTORY',
                'USE_EXTERNAL_EMOJIS'
            ]
        }]).then(channel => {
            channel.send({
                "embed": {
                    "title": "🇳🇱 Verifiëren",
                    "description": "Reageer alstublieft met **🇳🇱** om de regels in het Nederlands te bekijken.",
                    "color": 1409939,
                    "fields": [
                        {
                            "name": "🇬🇧 Verify",
                            "value": "Please react with **🇬🇧** to view the rules in English."
                        }
                    ],
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            }).then(message => {
                message.react('🇳🇱')
                message.react('🇬🇧')

                const nederlandsfilter = (reaction, user) => reaction.emoji.name === '🇳🇱' && user.id === member.id
                const engelsfilter = (reaction, user) => reaction.emoji.name === '🇬🇧' && user.id === member.id

                const nederlands = message.createReactionCollector(nederlandsfilter, { time: 2147483647 })
                const engels = message.createReactionCollector(engelsfilter, { time: 2147483647 })

                nederlands.on('collect', r => {
                    message.delete()
                    channel.send({
                        "embed": {
                            "title": "Verifiëren",
                            "description": `» Je mag niet spammen of schelden.\n» Limiteer het gebuik van shift/capslock\n» Iedereen die deze Discord joint hoort gerespecteerd te worden.\n» Iedereen hoort een normale naam te gebruiken.\n» Discrimineren of Pesten is niet toegestaan.\n» Je mag in geen enkele manier reclame maken, behalve als staff lid of met toestemming.\n» Je mag geen persoonlijke gegevens van anderen of van jezelf sturen in de openbare chats.\n» Je mag onze Discord bot niet proberen te besturen tegen staff leden.\n» Selfbots zijn niet toegestaan.\n» Je mag niet mee-discussieren met staff gerelateerde gesprekken, behalve gewenst.\n⚠ Als u deze regels niet volgt, ondernemen we actie.\n\nGaat u akoord met deze voorwaarden?\n**Reageer met ✅ of ❎**`,
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    }).then(msg => {
                        msg.react('✅')
                        msg.react('❎')

                        const allowFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === member.id
                        const denyFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === member.id

                        const allow = msg.createReactionCollector(allowFilter, { time: 10000 })
                        const deny = msg.createReactionCollector(denyFilter, { time: 10000 })

                        allow.on('collect', r => {
                            member.addRoles([
                                member.guild.roles.find(role => role.name.toLowerCase().match(/verified/)).id,
                                member.guild.roles.find(role => role.name.toLowerCase().match(/nl/)).id
                            ])
                            msg.channel.delete()

                            var channel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/welcome/))
                            var logchannel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
                            logchannel.send({
                                "embed": {
                                    "title": "Join",
                                    "description": "A user joined.",
                                    "color": 1409939,
                                    "fields": [
                                        {
                                            "name": "Name",
                                            "value": `${member.user.tag}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Id",
                                            "value": `${member.user.id}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Time",
                                            "value": `${new Date()}`,
                                            "inline": true
                                        }
                                    ],
                                    "thumbnail": {
                                        "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                                    },
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                            channel.send({
                                "embed": {
                                    "title": "🇳🇱 Welkom",
                                    "description": `Welkom **<@${member.user.id}>** op de officiële discord server van streampyhosting. Als u vragen heeft contacteer dan een van onze medewerkers.`,
                                    "color": 1409939,
                                    "thumbnail": {
                                        "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                                    },
                                    "fields": [{
                                        "name": "🇺🇸 Welcome",
                                        "value": `Welcome **<@${member.user.id}>** on the offcial discord server of Streampy Hosting. If you have any questions, please ask anyone of our staff.`
                                    }],
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                        deny.on('collect', r => {
                            channel.createInvite({
                                maxAge: 0,
                                maxUses: 1
                            }).then(invite => {
                                member.send({
                                    "embed": {
                                        "title": "Streampy Hosting Verifiëren",
                                        "description": `Omdat je onze regels niet hebt geaccepteerd, hebben we besloten je te kicken. Als u nog steeds lid wilt worden van de server, kunt u [hier](${invite.url}) klikken om te joinen en de regels accepteren.`,
                                        "color": 1409939,
                                        "footer": {
                                            "text": `© Copyright Streampyhosting - 2019`
                                        }
                                    }
                                }).then(() => {
                                    member.kick()
                                    channel.delete()
                                })
                            })
                        })
                    })
                })

                engels.on('collect', r => {
                    message.delete()
                    channel.send({
                        "embed": {
                            "title": "Verify",
                            "description": `» You can't spam or scold in our dicord.\n» Limit your use of shift/capslock\n» Everyone that joins this discord has to be respected.\n» Everyone has to use normal names.\n» Discriminating or bullying is not permitted..\n» You may not advertise in any way, except as a staff member or with permission.\n» You may not send personal information of others or yourself in the public chats.\n» You are not allowed to try our Discord bot against staff members.\n» Selfbots are not allowed.\n» You are not allowed to participate in discussions with staff related conversations, except if desired.\n⚠ If you don't follow our rules, we will take action.\n\nDo you agree with these rules?\n** React with ✅ or ❎ **`,
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    }).then(msg => {
                        msg.react('✅')
                        msg.react('❎')

                        const allowFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === member.id
                        const denyFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === member.id

                        const allow = msg.createReactionCollector(allowFilter, { time: 2147483647 })
                        const deny = msg.createReactionCollector(denyFilter, { time: 2147483647 })

                        allow.on('collect', r => {
                            member.addRoles([
                                member.guild.roles.find(role => role.name.toLowerCase().match(/verified/)).id,
                                member.guild.roles.find(role => role.name.toLowerCase().match(/en/)).id
                            ])
                            msg.channel.delete()

                            var channel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/welcome/))
                            var logchannel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
                            logchannel.send({
                                "embed": {
                                    "title": "Join",
                                    "description": "A user joined.",
                                    "color": 1409939,
                                    "fields": [
                                        {
                                            "name": "Name",
                                            "value": `${member.user.tag}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Id",
                                            "value": `${member.user.id}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Time",
                                            "value": `${new Date()}`,
                                            "inline": true
                                        }
                                    ],
                                    "thumbnail": {
                                        "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                                    },
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                            channel.send({
                                "embed": {
                                    "title": "🇳🇱 Welkom",
                                    "description": `Welkom **<@${member.user.id}>** op de officiële discord server van streampyhosting. Als u vragen heeft contacteer dan een van onze medewerkers.`,
                                    "color": 1409939,
                                    "thumbnail": {
                                        "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                                    },
                                    "fields": [{
                                        "name": "🇺🇸 Welcome",
                                        "value": `Welcome **<@${member.user.id}>** on the offcial discord server of Streampy Hosting. If you have any questions, please ask anyone of our staff.`
                                    }],
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                        deny.on('collect', r => {
                            channel.createInvite({
                                maxAge: 0,
                                maxUses: 1
                            }).then(invite => {
                                member.send({
                                    "embed": {
                                        "title": "Streampy Hosting Verify",
                                        "description": `Because you did not accept our rules, we decided to kick you. If you still want to join the server, you can join [here](${invite.url}) and accept the rules.`,
                                        "color": 1409939,
                                        "footer": {
                                            "text": `© Copyright Streampyhosting - 2019`
                                        }
                                    }
                                }).then(() => {
                                    member.kick()
                                    channel.delete()
                                })
                            })
                            
                        })
                    })
                })
            })
        })
    }
    
})

client.on('guildMemberRemove', member => {
    var channel = client.guilds.get(member.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
    channel.send({
        "embed": {
            "title": "Leave",
            "description": "A user left.",
            "color": 1409939,
            "fields": [
                {
                    "name": "Name",
                    "value": `${member.user.tag}`,
                    "inline": true
                },
                {
                    "name": "Id",
                    "value": `${member.user.id}`,
                    "inline": true
                },
                {
                    "name": "Time",
                    "value": `${new Date()}`,
                    "inline": true
                }
            ],
            "thumbnail": {
                "url": `${member.user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
            }
        }
    })
})

client.on('messageDelete', message => {
    if (message.channel.name.toLowerCase().match(/verify/)) return;
    var channel = client.guilds.get(message.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
    channel.send({
        "embed": {
            "title": "Delete",
            "description": "A message has been deleted.",
            "color": 1409939,
            "fields": [
                {
                    "name": "Username",
                    "value": `<@${message.author.id}> (${message.author.id})`,
                    "inline": true
                },
                {
                    "name": "From",
                    "value": `<#${message.channel.id}> (${message.channel.name})`,
                    "inline": true
                },
                {
                    "name": "Time",
                    "value": `${new Date()}`,
                    "inline": true
                },
                {
                    "name": "Message",
                    "value": `${message.content || '(was waarschijnlijk een embed wat niet vertoonbaar is)'}`
                }
            ],
            "thumbnail": {
                "url": `${message.author.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
            }
        }
    })
})

client.on('messageUpdate', (omsg, nmsg) => {
    if (omsg.type != 'text') return;

    const channel = client.guilds.get(nmsg.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
    const adminRole = nmsg.guild.roles.find(role => role.name.toLowerCase().match(/admin/)).id
    const notAllowed = [ 'http://', 'discord.gg', 'cancer', 'kanker', 'tyfus', 'fuck', 'kut', 'aids', 'jezus', 'godver' ]

    if (!nmsg.member.roles.has(adminRole) && notAllowed.some(word => nmsg.content.includes(word))) {
        if (omsg.content.length > 1000) {
            omsg.content = omsg.content.substring(0, 1000)
            omsg.content += '...'
        }
        if (nmsg.content.length > 1000) {
            nmsg.content = nmsg.content.substring(0, 1000)
            nmsg.content += '...'
        }
        nmsg.delete()
        channel.send({
            "embed": {
                "title": "Auto delete",
                "description": "A message has been deleted.",
                "color": 1409939,
                "fields": [
                    {
                        "name": "Deleted by",
                        "value": `<@${client.user.id}>`,
                        "inline": true
                    },
                    {
                        "name": "Username",
                        "value": `<@${nmsg.author.id}> (${nmsg.author.id})`,
                        "inline": true
                    },
                    {
                        "name": "From",
                        "value": `<#${nmsg.channel.id}> (${nmsg.channel.name})`,
                        "inline": true
                    },
                    {
                        "name": "Time",
                        "value": `${new Date()}`,
                        "inline": true
                    },
                    {
                        "name": "Message",
                        "value": `${nmsg.content || '(was waarschijnlijk een embed wat niet vertoonbaar is)'}`
                    }
                ],
                "thumbnail": {
                    "url": `${nmsg.author.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                }
            }
        })
    } else if (!nmsg.author.bot) {
        if (omsg.content.length > 1000) {
            omsg.content = omsg.content.substring(0, 1000)
            omsg.content += '...'
        }
        if (nmsg.content.length > 1000) {
            nmsg.content = nmsg.content.substring(0, 1000)
            nmsg.content += '...'
        }
        channel.send({
            "embed": {
                "title": "Message edit",
                "description": "A message has been edited.",
                "color": 1409939,
                "fields": [
                    {
                        "name": "Username",
                        "value": `<@${nmsg.author.id}> (${nmsg.author.id})`,
                        "inline": true
                    },
                    {
                        "name": "From",
                        "value": `<#${nmsg.channel.id}> (${nmsg.channel.name})`,
                        "inline": true
                    },
                    {
                        "name": "Time",
                        "value": `${new Date()}`,
                        "inline": true
                    },
                    {
                        "name": "Old message",
                        "value": `${omsg.content || '(was waarschijnlijk een embed wat niet vertoonbaar is)'}`
                    },
                    {
                        "name": "New message",
                        "value": `${nmsg.content || '(was waarschijnlijk een embed wat niet vertoonbaar is)'}`
                    }
                ],
                "thumbnail": {
                    "url": `${nmsg.author.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                }
            }
        })
    }
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (message.channel.name == undefined) return

    const logchannel = client.guilds.get(message.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))

    const notAllowed = [ 'http://', 'discord.gg', 'cancer', 'kanker', 'tyfus', 'fuck', 'kut', 'aids', 'jezus', 'godver' ]
    const adminRole = message.guild.roles.find(role => role.name.toLowerCase().match(/admin/)).id

    if (!message.member.roles.has(adminRole))
        if (notAllowed.some(word => message.content.includes(word))) {
            message.delete()
            logchannel.send({
                "embed": {
                    "title": "Auto delete",
                    "description": "A message has been deleted.",
                    "color": 1409939,
                    "fields": [
                        {
                          "name": "Deleted by",
                          "value": `<@${client.user.id}>`,
                          "inline": true
                        },
                        {
                            "name": "Username",
                            "value": `<@${message.author.id}> (${message.author.id})`,
                            "inline": true
                        },
                        {
                            "name": "From",
                            "value": `<#${message.channel.id}> (${message.channel.name})`,
                            "inline": true
                        },
                        {
                            "name": "Time",
                            "value": `${new Date()}`,
                            "inline": true
                        },
                        {
                            "name": "Message",
                            "value": `${message.content}`
                        }
                    ],
                    "thumbnail": {
                        "url": `${message.author.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}`
                    }
                }
            })
        }

    if (!message.content.startsWith(config.prefix)) return

    function getargs(index) {
        var temp = message.content.slice(config.prefix.length).trim().split(/ +/g)
        temp.shift()
        var ret = (temp[index] == undefined) ? undefined : temp[index]
        if (typeof index == "number") return ret
        else return temp
    }

    const command = message.content.slice(config.prefix.length).trim().split(/ +/g).shift().toLowerCase()

    if (command == 'review') {
        if (getargs(0) && getargs(0).match(/[1-5]/)) {
            var msg = {
                "embed": {
                    "title": "Review",
                    "description": `**${message.author.tag}** has send a review about **${message.guild.name}**!`,
                    "color": 1409939,
                    "fields": [],
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            }

            var rating = ''
            for (var i = 0; i < parseInt(getargs(0)); i++) rating += '⭐'

            msg.embed.fields.push({
                "name": "Stars",
                "value": `${rating}`,
                "inline": true
            })
            const args = getargs()
            args.shift()
            if (args.length > 0) {
                if (message.content.slice(config.prefix.length).trim().replace(command, '').replace(/[0-5] /, '').length < 1000) {
                    msg.embed.fields.push({
                        "name": "Message",
                        "value": `${message.content.slice(config.prefix.length).trim().replace(command, '').replace(/[0-5] /, '')}`,
                        "inline": true
                    })
                } else return message.channel.send({
                    "embed": {
                        "title": "Review",
                        "description": `Your review is a bit to long (**${message.content.slice(config.prefix.length).trim().replace(command, '').replace(/[0-5] /, '').length}** characters), please reduce it to **1000** or less.`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampyhosting - 2019`
                        }
                    }
                })
            }
            
            message.guild.channels.find(channel => channel.name.toLowerCase().match(/review/)).send(msg)
            message.delete()
            message.channel.send({
                "embed": {
                    "title": "Review",
                    "description": `Thanks **${message.author.username}** for your review, it has been send in the <#${message.guild.channels.find(channel => channel.name.toLowerCase().match(/review/)).id}> channel!`,
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        } else {
            message.channel.send({
                "embed": {
                    "title": "Review",
                    "description": "Review usage: `+review <1-5> [review]`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    } else
    if (command == 'ticket') {
        const channelname = `ticket_${config.channelAmmount.toString().padStart(4, '0')}`
        const allowedPersonId = message.author.id
        const allowedAdminId = message.guild.roles.find(role => role.name.toLowerCase().match(/admin/)).id

        message.delete()

        message.guild.createChannel(channelname, 'text', [{
            id: message.guild.id,
            deny: 1024
        }, {
            id: allowedPersonId,
            allow: 511040
        }, {
            id: allowedAdminId,
            allow: 2080898295
        }]).then(channel => {
            //channel.setParent('527421636132208640') FIXME: verander "527421636132208640" naar de gewenste category id
            channel.send({
                "embed": {
                    "title": `${channel.name}`,
                    "description": `In this channel you can ask the moderators questions.`,
                    "color": 1409939,
                    "fields": [{
                        "name": `User`,
                        "value": `<@${message.author.id}>`,
                        "inline": true
                    }, {
                        "name": `Question`,
                        "value": `${(getargs().length > 0) ? message.content.slice(config.prefix.length).trim().replace(command, '') : `*No question given...*`}`,
                        "inline": true
                    }, {
                        "name": `Waiting`,
                        "value": `It may be that it takes a little while until we, the admins of **${message.guild.name}**, get to you.`
                    }],
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
            message.channel.send({
                "embed": {
                    "title": `Ticket`,
                    "description": `The channel **<#${channel.id}>** has been created for you!`,
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
            config.channelAmmount++
        }).catch(err => message.channel.send({
            "embed": {
                "title": `Ticket`,
                "description": `Something went wrong while creating your private channel.`,
                "color": 13632027,
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        }))
    } else
    if (command == 'close') {
        if (!message.member.roles.has(adminRole)) return;
        if (message.channel.name.match(/ticket_[0-9]+/)) {
            message.delete()
            message.channel.send({
                "embed": {
                    "title": "Close",
                    "description": `Are you sure you want to close **${message.channel.name}**?\n\n\`\`\`Answer with ✅ or ❎\`\`\``,
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            }).then(msg => {
                msg.react('✅')
                msg.react('❎')

                const allowFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id
                const denyFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id

                const allow = msg.createReactionCollector(allowFilter, { time: 10000 })
                const deny = msg.createReactionCollector(denyFilter, { time: 10000 })

                allow.on('collect', r => {
                    msg.delete()
                    message.channel.send({
                        "embed": {
                            "title": "Close",
                            "description": "K bye!",
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    })
                    setTimeout(() => {
                        message.channel.delete()
                    }, 200)
                })
                deny.on('collect', r => {
                    msg.delete()
                    message.channel.send({
                        "embed": {
                            "title": "Close",
                            "description": "Not deleting the channel!",
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    }).then(m => setTimeout(() => m.delete(), 5000))
                })
            })
        }
    } else
    if (command == 'help') {
        const user = config.commands.user
        const admin = config.commands.admin
        var found = false

        if (getargs(0)) {
            var msg = {
                embed: {
                    title: 'Help',
                    description: `All the commands named **${getargs(0).toLowerCase()}**. If you didn't find the command you were looking for type \`+help\`.\n\n**<>** = required, *[]* = optional, | = or\n${space}`,
                    color: 1409939,
                    fields: [],
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            }

            user.forEach(item => {
                if (
                    item.usage.replace('+', '').split(' ')[0].split('|')[0].toLowerCase() == getargs(0).toLowerCase() ||
                    item.usage.replace('+', '').split(' ')[0].split('|').join('').toLowerCase() == getargs(0).toLowerCase() ||
                    item.name.toLowerCase().match(new RegExp(`${getargs(0).toLowerCase()}`))
                ) {
                    found = true
                    var cmd = `+__${item.usage.split(/(\+([a-z]|\|)+)/)[1].replace('|', '**').replace('|', '**').replace('+', '')}__`
                    var arguments = item.usage.split(/(\+([a-z]|\|)+ ?)/)[3]
                        .split('<').join('**<')
                        .split('>').join('>**')
                        .split('[').join('*[')
                        .split(']').join(']*')
                    var parameters = ''

                    if (item.parameters)
                        Object.keys(item.parameters).forEach(param => {
                            parameters += `• ${item.parameters[param].required ? '**' : '*'}__${param}__${item.parameters[param].required ? '**' : '*'}: ${item.parameters[param].description.replace(/• /g, `${String.fromCharCode(0x2003)}• `)}\n`
                        })

                    msg.embed.fields.push({
                        name: `-----==={ }===-----`,
                        value: `**${item.name}**\n${item.description}\n\n${cmd} ${arguments}${item.parameters ? `\n\n**Parameters**\n${parameters}` : ''}`
                    })
                }
            })

            if (message.member.roles.has(adminRole)) admin.forEach(item => {
                if (
                    item.usage.replace('+', '').split(' ')[0].split('|')[0].toLowerCase() == getargs(0).toLowerCase() ||
                    item.usage.replace('+', '').split(' ')[0].split('|').join('').toLowerCase() == getargs(0).toLowerCase() ||
                    item.name.toLowerCase().match(new RegExp(`${getargs(0).toLowerCase()}`))
                ) {
                    found = true
                    var cmd = `+__${item.usage.split(/(\+([a-z]|\|)+)/)[1].replace('|', '**').replace('|', '**').replace('+', '')}__`
                    var arguments = item.usage.split(/(\+([a-z]|\|)+ ?)/)[3]
                        .split('<').join('**<')
                        .split('>').join('>**')
                        .split('[').join('*[')
                        .split(']').join(']*')
                    var parameters = ''

                    if (item.parameters)
                        Object.keys(item.parameters).forEach(param => {
                            parameters += `• ${item.parameters[param].required ? '**' : '*'}__${param}__${item.parameters[param].required ? '**' : '*'}: ${item.parameters[param].description.replace(/• /g, `${String.fromCharCode(0x2003)}• `)}\n`
                        })

                    msg.embed.fields.push({
                        name: `-----==={ }===-----`,
                        value: `**${item.name}**\n${item.description}\n\n${cmd} ${arguments}${item.parameters ? `\n\n**Parameters**\n${parameters}` : ''}`
                    })
                }
            })

            if (found) {
                message.author.send(msg)
                message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
            } else {
                message.channel.send({
                    embed: {
                        title: 'Help',
                        description: `There were no commands found named **${getargs(0)}**.`,
                        color: 1409939
                    }
                })
            }
        } else {
            var msg = {
                embed: {
                    title: 'Help',
                    description: `**<>** = required, *[]* = optional, | = or\n${space}`,
                    color: 1409939,
                    fields: [],
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            }

            msg.embed.fields.push({
                name: `-----==={ }===-----`,
                value: `**Standard commands**\n${space}`
            })
            user.forEach(item => {
                var cmd = `+__${item.usage.split(/(\+([a-z]|\|)+)/)[1].replace('|', '**').replace('|', '**').replace('+', '')}__`
                var arguments = item.usage.split(/(\+([a-z]|\|)+ ?)/)[3]
                    .split('<').join('**<')
                    .split('>').join('>**')
                    .split('[').join('*[')
                    .split(']').join(']*')
                msg.embed.fields.push({
                    name: `${item.name}`,
                    value: `${item.description}\n\n${cmd} ${arguments}\n${space}`
                })
            })

            if (message.member.roles.has(adminRole)) {
                msg.embed.fields.push({
                    name: `-----==={ }===-----`,
                    value: `**Admin commands**\n${space}`
                })
                admin.forEach(item => {
                    var cmd = `+__${item.usage.split(/(\+([a-z]|\|)+)/)[1].replace('|', '**').replace('|', '**').replace('+', '')}__`
                    var arguments = item.usage.split(/(\+([a-z]|\|)+ ?)/)[3]
                        .split('<').join('**<')
                        .split('>').join('>**')
                        .split('[').join('*[')
                        .split(']').join(']*')
                    msg.embed.fields.push({
                        name: `${item.name}`,
                        value: `${item.description}\n\n${cmd} ${arguments}\n${space}`
                    })
                })
            }
            message.author.send(msg)
            message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
        }
    } else
    if (command == 'add') {
        if (!message.member.roles.has(adminRole)) return;

        message.delete()
        if (message.mentions.members.first()) {
            message.channel.overwritePermissions(message.mentions.members.first().user.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                ADD_REACTIONS: true,
                EMBED_LINKS: true,
                READ_MESSAGE_HISTORY: true,
                USE_EXTERNAL_EMOJIS: true
            }).then(updated => {
                message.channel.send({
                    "embed": {
                        "title": "Add user",
                        "description": `Succesfully added **${message.mentions.members.first().user.username}**.`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampyhosting - 2019`
                        }
                    }
                })
            })
        } else {
            message.channel.send({
                "embed": {
                    "title": "Add user",
                    "description": "Add user usage: `+add <user>`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    } else
    if (command == 'del') {
        if (!message.member.roles.has(adminRole)) return;

        message.delete()
        if (message.mentions.members.first()) {
            message.channel.overwritePermissions(message.mentions.members.first().user.id, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                ATTACH_FILES: false,
                ADD_REACTIONS: false,
                EMBED_LINKS: false,
                READ_MESSAGE_HISTORY: false,
                USE_EXTERNAL_EMOJIS: false
            }).then(updated => {
                message.channel.send({
                    "embed": {
                        "title": "Add user",
                        "description": `Succesfully removed **${message.mentions.members.first().user.username}**.`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampyhosting - 2019`
                        }
                    }
                })
            })
        } else {
            message.channel.send({
                "embed": {
                    "title": "Add user",
                    "description": "Add user usage: `+add <user>`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    } else
    if (command == 'ping') {
        const m = await message.channel.send({
            "embed": {
                "title": "Ping",
                "description": `Calculating ping...`,
                "color": 2434341,
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        })
        m.edit({
            "embed": {
                "title": "Ping",
                "description": `Bot ping is **__${m.createdTimestamp - message.createdTimestamp}__ms**${(m.createdTimestamp - message.createdTimestamp <= 10) ? ' 😱' : ''}.\nAPI ping is **__${parseInt(client.ping)}__ms**${(client.ping <= 10) ? ' 😱' : ''}`,
                "color": (m.createdTimestamp - message.createdTimestamp < 500 && client.ping < 500) ? 8311585 : 13632027,
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        })
    } else
    if (command == 'say') {
        if (!message.member.roles.has(adminRole)) return;
        message.delete()
        var msg = message.content.replace('+say', '').trim()
        if (msg == '') return message.channel.send({
            "embed": {
                "title": "Say",
                "description": "Please leave something for me to say.",
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        })
        var channel = message.guild.channels.find(chan => chan.name.toLowerCase().match(/announcement/))
        channel.send(msg).catch(err => console.error(err))
    } else
    if (command == 'saye') {
        if (!message.member.roles.has(adminRole)) return;
        message.delete()
        if (!message.content.match(/([a-z]|[A-Z]| )+\| *([a-z]|[A-Z]| )+/)) return message.channel.send({
            "embed": {
                "title": "Say embed",
                "description": "Say embed usage: `+saye <title> | <text>`",
                "color": 1409939,
                "footer": {
                    "text": `© Copyright Streampyhosting - 2019`
                }
            }
        })
        var title = message.content.replace('+saye', '').split('|')[0].trim()
        var text = message.content.replace(/\|/, '|||||').split('|||||')[1].trim()
        var channel = message.guild.channels.find(chan => chan.name.toLowerCase().match(/announcement/))
        channel.send({
            "embed": {
                "title": `${title}`,
                "description": `${text}`,
                "color": 1409939,
                "footer": {
                    "text": "© Copyright Streampyhosting - 2019"
                }
            }
        }).catch(err => console.error(err))
        channel.send('@everyone').then(msg => msg.delete())
    } else
    if (command == 'suggest') {
        if (getargs(0)) {
            var channel = message.guild.channels.find(chan => chan.name.toLowerCase().match(/suggestion/))
            channel.send({
                "embed": {
                    "title": "Suggestion",
                    "description": `${message.content.replace('+suggest', '').trim()}`,
                    "color": 1409939,
                    "footer": {
                        "text": "© Copyright Streampyhosting - 2019"
                    },
                    "fields": [
                        {
                            "name": "Suggested by",
                            "value": `<@${message.author.id}>`
                        }
                    ]
                }
            }).then(msg => {
                msg.react('👍')
                msg.react('👎')
                message.react('👌').then(() => setTimeout(() => message.delete(), 3000))
            })
        } else {
            message.channel.send({
                "embed": {
                    "title": "Suggest",
                    "description": "Suggest usage: `+suggest <suggestion>`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
            message.delete()
        }
    } else
    if (command == 'link') {
        message.delete()
        message.channel.send({
            "embed": {
                "title": "Links",
                "description": "» [Our website](https://streampy.nl)\n» [Our panel](https://panel.streampy.nl)\n» [Our discord](https://discord.gg/cTh9SZ2)\n» For questions: info@streampy.nl\n» [Our YouTube](https://youtube.com/streampy)\n» [Our Twitter](https://twitter.com/StreampyH)",
                "url": "https://streampy.nl",
                "color": 1409939
            }
        })
    } else
    if (command == 'warn') {
        if (!message.member.roles.has(adminRole)) return;

        message.delete()
        const user = message.mentions.members.first()
        const reason = message.content.replace(/\+(([a-z]|@|<|>|[0-9])* *){2}/, '')

        if (user && reason != '') {
            message.channel.send({
                "embed": {
                    "title": "Warn",
                    "description": `**<@${user.id}>** has been warned for "${reason}".`,
                    "color": 1409939,
                    "footer": { "text": "© Copyright Streampyhosting - 2019" }
                }
            })

            if (!warnedUsers.get(user.id)) warnedUsers.set(user.id, 0)
            warnedUsers.set(user.id, warnedUsers.get(user.id) + 1)

            if (warnedUsers.get(user.id) >= 3) {
                const muteRole = message.guild.roles.find(role => role.name.toLowerCase().match(/muted/)).id
                var channel = client.guilds.get(message.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
                user.addRole(muteRole)
                    .then(u => {
                        message.channel.send({
                            "embed": {
                                "title": "Warn",
                                "description": `**<@${user.id}>** has been muted for "${warnedUsers.get(u.id)}th time being warned".`,
                                "color": 1409939,
                                "footer": { "text": "© Copyright Streampyhosting - 2019" }
                            }
                        })

                        setTimeout(() => {
                            if (message.guild.members.find(_user => _user.id === u.id)) {
                                u.removeRole(muteRole)
                                    .then(_u => {

                                    })
                                    .catch(_e => channel.send({
                                        "embed": {
                                            "title": "Warn",
                                            "description": `Something went wrong wile automatically unmuting **${user.user.tag}** :(\n\n${e}`,
                                            "color": 1409939,
                                            "footer": {
                                                "text": `© Copyright Streampyhosting - 2019`
                                            }
                                        }
                                    }))
                            }
                        }, 7200000)
                    })
                    .catch(e => message.channel.send({
                        "embed": {
                            "title": "Warn",
                            "description": `Something went wrong :(\n\n${e}`,
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    }))
            }
        } else if (user) {
            message.channel.send({
                "embed": {
                    "title": "Warn",
                    "description": `**<@${user.id}>** has been warned.`,
                    "color": 1409939,
                    "footer": { "text": "© Copyright Streampyhosting - 2019" }
                }
            })

            if (!warnedUsers.get(user.id)) warnedUsers.set(user.id, 0)
            warnedUsers.set(user.id, warnedUsers.get(user.id) + 1)

            if (warnedUsers.get(user.id) >= 3) {
                const muteRole = message.guild.roles.find(role => role.name.toLowerCase().match(/muted/)).id
                var channel = client.guilds.get(message.guild.id).channels.find(channel => channel.name.toLowerCase().match(/staff-logs/))
                user.addRole(muteRole)
                    .then(u => {
                        message.channel.send({
                            "embed": {
                                "title": "Warn",
                                "description": `**<@${user.id}>** has been muted for "${warnedUsers.get(u.id)}th time being warned".`,
                                "color": 1409939,
                                "footer": { "text": "© Copyright Streampyhosting - 2019" }
                            }
                        })

                        setTimeout(() => {
                            if (message.guild.members.find(_user => _user.id === u.id)) {
                                u.removeRole(muteRole)
                                    .then(_u => {

                                    })
                                    .catch(_e => channel.send({
                                        "embed": {
                                            "title": "Warn",
                                            "description": `Something went wrong wile automatically unmuting **${user.user.tag}** :(\n\n${e}`,
                                            "color": 1409939,
                                            "footer": {
                                                "text": `© Copyright Streampyhosting - 2019`
                                            }
                                        }
                                    }))
                            }
                        }, 7200000)
                    })
                    .catch(e => message.channel.send({
                        "embed": {
                            "title": "Warn",
                            "description": `Something went wrong :(\n\n${e}`,
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    }))
            }
        } else {
            message.channel.send({
                "embed": {
                    "title": "Warn",
                    "description": "Warn usage: `+warn <user> [reason]`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    } else
    if (command == 'log') {
        var allWarnedusers = '----------------\nUsername#tag (id) - warns\n'
        for (var [ id, timesWarned ] of warnedUsers.entries()) {
            var user = message.guild.members.find(u => u.id === id)
            allWarnedusers += `\n${user.user.tag} (${id}) - ${timesWarned}`
        }
        allWarnedusers += '\n----------------'
        console.log(allWarnedusers)
    } else
    if (command == 'mute') {
        if (!message.member.roles.has(adminRole)) return;

        message.delete()
        const muteRole = message.guild.roles.find(role => role.name.toLowerCase().match(/muted/)).id
        const user = message.mentions.members.first()

        if (muteRole && user) {
            user.addRole(muteRole)
                .then(user => {
                    message.channel.send({
                        "embed": {
                            "title": "Mute",
                            "description": `Succesfully muted **${user.user.tag}**.`,
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    })
                })
                .catch(e => message.channel.send({
                    "embed": {
                        "title": "Mute",
                        "description": `Something went wrong :(\n\n${e}`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampyhosting - 2019`
                        }
                    }
                }))
        } else {
            if (!muteRole) return message.channel.send({
                embed: {
                    description: `How am I supposed to mute people if you don\'t even have a muted role?`,
                    color: 1409939
                }
            })

            message.channel.send({
                "embed": {
                    "title": "Mute",
                    "description": "Mute usage: `+mute <user>`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    } else
    if (command == 'unmute') {
        if (!message.member.roles.has(adminRole)) return;

        message.delete()
        const muteRole = message.guild.roles.find(role => role.name.toLowerCase().match(/muted/)).id
        const user = message.mentions.members.first()

        if (muteRole && user) {
            user.removeRole(muteRole)
                .then(user => {
                    message.channel.send({
                        "embed": {
                            "title": "Unmute",
                            "description": `Succesfully unmuted **${user.user.tag}**.`,
                            "color": 1409939,
                            "footer": {
                                "text": `© Copyright Streampyhosting - 2019`
                            }
                        }
                    })
                })
                .catch(e => message.channel.send({
                    "embed": {
                        "title": "Unmute",
                        "description": `Something went wrong :(\n\n${e}`,
                        "color": 1409939,
                        "footer": {
                            "text": `© Copyright Streampyhosting - 2019`
                        }
                    }
                }))
        } else {
            if (!muteRole) return message.channel.send({
                embed: {
                    description: `How am I supposed to unmute people if you don\'t even have a muted role?`,
                    color: 1409939
                }
            })

            message.channel.send({
                "embed": {
                    "title": "Unmute",
                    "description": "Unmute usage: `+unmute <user>`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    } else
    if (command == 'kick') {
        if (!message.member.roles.has(adminRole)) return;

        message.delete()
        if (!message.mentions.members.first()) {
            message.channel.send({
                "embed": {
                    "title": "Kick",
                    "description": "Kick usage: `+kick <user> [reason]`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        } else {
            var user = message.mentions.members.first()
            var reason = message.content.replace(/\+(([a-z]|@|<|>|[0-9])* *){2}/, '')

            if (reason != '') {
                user.send({
                    "embed": {
                        "title": "Kick",
                        "description": `You have been kicked form **${message.guild.name}**.`,
                        "color": 1409939,
                        "footer": { "text": "© Copyright Streampyhosting - 2019" },
                        "fields": [{
                            "name": "Time",
                            "value": `${new Date()}`
                        },
                        {
                            "name": "Kicked by",
                            "value": `${message.author.tag} (${message.author.id})`
                        },
                        {
                            "name": "Reason",
                            "value": `${reason}`
                        }]
                    }
                }).then(msg => {
                    user.kick(reason)
                        .then(user => {
                            message.channel.send({
                                "embed": {
                                    "title": "Kick",
                                    "description": `Succesfully kicked **${user.user.tag}** for "${reason}".`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                        .catch(e => {
                            message.channel.send({
                                "embed": {
                                    "title": "Kick",
                                    "description": `Something went wrong :(\n\n${e}`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                })
            } else {
                user.send({
                    "embed": {
                        "title": "Kick",
                        "description": `You have been kicked form **${message.guild.name}**.`,
                        "color": 1409939,
                        "footer": { "text": "© Copyright Streampyhosting - 2019" },
                        "fields": [{
                            "name": "Time",
                            "value": `${new Date()}`
                        },
                        {
                            "name": "Kicked by",
                            "value": `${message.author.tag} (${message.author.id})`
                        }]
                    }
                }).then(msg => {
                    user.kick()
                        .then(user => {
                            message.channel.send({
                                "embed": {
                                    "title": "Kick",
                                    "description": `Succesfully kicked **${user.user.tag}**.`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })

                            
                        })
                        .catch(e => {
                            message.channel.send({
                                "embed": {
                                    "title": "Kick",
                                    "description": `Something went wrong :(\n\n${e}`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                })
            }
        }
    } else
    if (command == 'ban') {
        message.delete()
        if (!message.member.roles.has(adminRole)) return;

        if (!message.mentions.members.first()) {
            message.channel.send({
                "embed": {
                    "title": "Ban",
                    "description": "Ban usage: `+ban <user> [reason]`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        } else {
            var user = message.mentions.members.first()
            var reason = message.content.replace(/\+(([a-z]|@|<|>|[0-9])* *){2}/, '')

            if (reason != '') {
                user.send({
                    "embed": {
                        "title": "Ban",
                        "description": `You have been banned form **${message.guild.name}**.`,
                        "color": 1409939,
                        "footer": { "text": "© Copyright Streampyhosting - 2019" },
                        "fields": [{
                            "name": "Time",
                            "value": `${new Date()}`
                        },
                        {
                            "name": "Banned by",
                            "value": `${message.author.tag} (${message.author.id})`
                        },
                        {
                            "name": "Reason",
                            "value": `${reason}`
                        }]
                    }
                }).then(msg => {
                    user.ban({ reason: reason })
                        .then(user => {
                            message.channel.send({
                                "embed": {
                                    "title": "Ban",
                                    "description": `Succesfully banned **${user.user.tag}** for "${reason}".`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                        .catch(e => {
                            message.channel.send({
                                "embed": {
                                    "title": "Ban",
                                    "description": `Something went wrong :(\n\n${e}`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                })
            } else {
                user.send({
                    "embed": {
                        "title": "Ban",
                        "description": `You have been banned form **${message.guild.name}**.`,
                        "color": 1409939,
                        "footer": { "text": "© Copyright Streampyhosting - 2019" },
                        "fields": [{
                            "name": "Time",
                            "value": `${new Date()}`
                        },
                        {
                            "name": "Banned by",
                            "value": `${message.author.tag} (${message.author.id})`
                        }]
                    }
                }).then(msg => {
                    user.ban()
                        .then(user => {
                            message.channel.send({
                                "embed": {
                                    "title": "Ban",
                                    "description": `Succesfully banned **${user.user.tag}**.`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                        .catch(e => {
                            message.channel.send({
                                "embed": {
                                    "title": "Ban",
                                    "description": `Something went wrong :(\n\n${e}`,
                                    "color": 1409939,
                                    "footer": {
                                        "text": `© Copyright Streampyhosting - 2019`
                                    }
                                }
                            })
                        })
                })
            }
        }
    } else
    if (command == 'redeem') {
        message.delete()

        if (getargs(0)) {
            if (getargs(0).toString() === message.author.id.toString()) {
                // TODO: assign role
            }
        } else {
            message.channel.send({
                "embed": {
                    "title": "Redeem",
                    "description": "Redeem usage: `+redeem <coupon code>`",
                    "color": 1409939,
                    "footer": {
                        "text": `© Copyright Streampyhosting - 2019`
                    }
                }
            })
        }
    }
})

client.login(config.token)
