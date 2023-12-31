function Authentication(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Authentication;
  if (!keyConfig || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '鉴权配置(Authentication)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const type = keyConfig.TypeA ? 'TypeA' : keyConfig.TypeB ? 'TypeB' : keyConfig.TypeC ? 'TypeC' : 'TypeD';

  const eoRule = {
    'Rules': [
      {
        'Conditions': [{
          'Conditions': [
            {
              'Operator': keyConfig[type].FilterType === 'whitelist' ? 'notequal' : 'equal',
              'Target': 'extension',
              'IgnoreCase': false,
              'Values': keyConfig[type].FileExtensions
            }
          ]
        }],
        'Actions': [
          {
            'NormalAction': {
              'Action': 'Authentication',
              'Parameters': [
                {
                  'Name': 'AuthType',
                  'Values': [type]
                },
                {
                  'Name': 'ExpireTime',
                  'Values': [String(keyConfig[type].ExpireTime)]
                },
                {
                  'Name': 'SecretKey',
                  'Values': [keyConfig[type].SecretKey]
                },
                {
                  'Name': 'BackupSecretKey',
                  'Values': [keyConfig[type].BackupSecretKey]
                },
                {
                  'Name': 'SignParam',
                  'Values': [keyConfig[type].SignParam]
                }
              ]
            }
          }
        ]
      }
    ]
  };

  if (type === 'TypeD') {
    eoRule.Rules[0].Actions[0].NormalAction.Parameters.push({
      'Name': 'TimeParam',
      'Values': [keyConfig[type].TimeParam]
    }, {
      'Name': 'TimeFormat',
      'Values': [keyConfig[type].TimeFormat]
    });
  }

  ruleTransferLog.push({
    config: '鉴权配置(Authentication)',
    result: '成功',
    detail: ''
  });

  return eoRule;
}

module.exports = Authentication;