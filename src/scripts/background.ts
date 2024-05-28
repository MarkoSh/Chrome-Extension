( async () => {
	const resourceTypes	: string[]	= Object.values( chrome.declarativeNetRequest.ResourceType );

	const addRules		: Rule[] 	= [ {
		id		: 1,
		priority: 1,
		action	: {
			type			: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
			responseHeaders	: [ {
				operation	: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
				header		: 'content-security-policy',
			}, ]
		},
		condition: {
			resourceTypes,
		}
	}, ];

	const currentRules	: Rule[] 	= await chrome.declarativeNetRequest.getDynamicRules();
	const removeRuleIds	: number[]	= currentRules.map( rule => rule.id );

	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds,
		addRules
	} );
} )();