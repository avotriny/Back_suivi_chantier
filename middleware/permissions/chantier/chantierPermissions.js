import checkOwner from './checkOwner.js'

const chantierPermissions = {
    update:{
        roles:['Directeur' + ' ' + 'de'+ ' '+ 'chantier', 'Chef' + ' ' + 'de' +' '+ 'controle/Maître'+ ' '+ 'd\'ouvrage'],
        owner: checkOwner,
    },
    delete:{
        roles:['Directeur' + ' ' + 'de'+ ' '+ 'chantier', 'Chef' + ' ' + 'de' +' '+ 'controle/Maître'+ ' '+ 'd\'ouvrage'],
        owner:checkOwner,
    }
}

export default chantierPermissions;