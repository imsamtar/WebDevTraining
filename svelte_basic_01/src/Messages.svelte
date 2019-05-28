<script>
    import {createEventDispatcher} from 'svelte';

    export let msgs;
    export let i;

    let dispatch = createEventDispatcher();
    function deleteMessage(e){
        let index = Number.parseInt(e.srcElement.id);
        dispatch('delmsg', {
            index
        });
    }
</script>
<style>
    li {
        margin: 10px;
    }
    li > font {
        display: inline-block;
        width: 100px;
        font-size: 20px;
    }
    li > span {
        display: inline-block;
        width: 40px;
        background: #ff0000aa;
        color: white;
        font-size: 30px;
        cursor: pointer;
        text-align: center;
    }
</style>
<div style="width: 50%">
    <h1>Component # {i}</h1>
    <ul>
    {#each msgs as message, index}
        <li><font>{message}</font> <span on:click={deleteMessage} id={index}>x</span></li>
    {/each}
    </ul>
    <p>{msgs.length}</p>
</div>