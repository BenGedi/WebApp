document.getElementById('btn-settings').addEventListener('click',function(e){
	var target = e ? e.target : window.event.srcElement;
	var hasActive = target.classList.contains('active');
	var setting = document.getElementById('settings');
	if(hasActive){
		target.classList.remove('active');
		setting.classList.add('hidden');
	}else {
		target.classList.add('active');
		setting.classList.remove('hidden');
	}
});
