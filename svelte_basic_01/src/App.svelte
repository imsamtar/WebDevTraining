<script>
	import Messages from './Messages.svelte';

	let msgs = ['a', 'b', 'c'];
	let newMsgText = '';

	function delMessage(event){
		let index = event.detail.index;
		msgs = msgs.filter(m => m!=msgs[index]);
	}

	function newMessage(e){
		e.preventDefault();
		msgs = [...msgs, newMsgText];
		newMsgText = '';
	}


</script>

<style>
	#newMessage {
		display: flex;
		align-items: center;
	}
	[type=submit] {
		background: #2a2a2a;
		color: #eeeeee;
		border: 0;
	}

</style>
<form on:submit={newMessage}>
	<input type="text" bind:value={newMsgText}>
	<input type="submit">
</form>
<div style="display:flex">
	<Messages msgs={msgs} i={1} on:delmsg={delMessage}/>
	<Messages msgs={msgs} i={2} on:delmsg={delMessage}/>
</div>