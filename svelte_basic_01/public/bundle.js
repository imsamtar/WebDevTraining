
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_style(node, key, value) {
        node.style.setProperty(key, value);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy(component, detaching) {
        if (component.$$) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                $$.fragment.l(children(options.target));
            }
            else {
                $$.fragment.c();
            }
            if (options.intro && component.$$.fragment.i)
                component.$$.fragment.i();
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Messages.svelte generated by Svelte v3.4.4 */

    const file = "src/Messages.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.message = list[i];
    	child_ctx.index = i;
    	return child_ctx;
    }

    // (37:4) {#each msgs as message, index}
    function create_each_block(ctx) {
    	var li, font, t0_value = ctx.message, t0, t1, span, dispose;

    	return {
    		c: function create() {
    			li = element("li");
    			font = element("font");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			span.textContent = "x";
    			font.className = "svelte-1krdtsj";
    			add_location(font, file, 37, 12, 773);
    			span.id = ctx.index;
    			span.className = "svelte-1krdtsj";
    			add_location(span, file, 37, 35, 796);
    			li.className = "svelte-1krdtsj";
    			add_location(li, file, 37, 8, 769);
    			dispose = listen(span, "click", ctx.deleteMessage);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, font);
    			append(font, t0);
    			append(li, t1);
    			append(li, span);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msgs) && t0_value !== (t0_value = ctx.message)) {
    				set_data(t0, t0_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	var div, h1, t0, t1, t2, ul, t3, p, t4_value = ctx.msgs.length, t4;

    	var each_value = ctx.msgs;

    	var each_blocks = [];

    	for (var i_1 = 0; i_1 < each_value.length; i_1 += 1) {
    		each_blocks[i_1] = create_each_block(get_each_context(ctx, each_value, i_1));
    	}

    	return {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Component # ");
    			t1 = text(ctx.i);
    			t2 = space();
    			ul = element("ul");

    			for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
    				each_blocks[i_1].c();
    			}

    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			add_location(h1, file, 34, 4, 692);
    			add_location(ul, file, 35, 4, 721);
    			add_location(p, file, 40, 4, 878);
    			set_style(div, "width", "50%");
    			add_location(div, file, 33, 0, 663);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h1);
    			append(h1, t0);
    			append(h1, t1);
    			append(div, t2);
    			append(div, ul);

    			for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
    				each_blocks[i_1].m(ul, null);
    			}

    			append(div, t3);
    			append(div, p);
    			append(p, t4);
    		},

    		p: function update(changed, ctx) {
    			if (changed.i) {
    				set_data(t1, ctx.i);
    			}

    			if (changed.deleteMessage || changed.msgs) {
    				each_value = ctx.msgs;

    				for (var i_1 = 0; i_1 < each_value.length; i_1 += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i_1);

    					if (each_blocks[i_1]) {
    						each_blocks[i_1].p(changed, child_ctx);
    					} else {
    						each_blocks[i_1] = create_each_block(child_ctx);
    						each_blocks[i_1].c();
    						each_blocks[i_1].m(ul, null);
    					}
    				}

    				for (; i_1 < each_blocks.length; i_1 += 1) {
    					each_blocks[i_1].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if ((changed.msgs) && t4_value !== (t4_value = ctx.msgs.length)) {
    				set_data(t4, t4_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { msgs, i } = $$props;

        let dispatch = createEventDispatcher();
        function deleteMessage(e){
            let index = Number.parseInt(e.srcElement.id);
            dispatch('delmsg', {
                index
            });
        }

    	const writable_props = ['msgs', 'i'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Messages> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msgs' in $$props) $$invalidate('msgs', msgs = $$props.msgs);
    		if ('i' in $$props) $$invalidate('i', i = $$props.i);
    	};

    	return { msgs, i, deleteMessage };
    }

    class Messages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["msgs", "i"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msgs === undefined && !('msgs' in props)) {
    			console.warn("<Messages> was created without expected prop 'msgs'");
    		}
    		if (ctx.i === undefined && !('i' in props)) {
    			console.warn("<Messages> was created without expected prop 'i'");
    		}
    	}

    	get msgs() {
    		throw new Error("<Messages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msgs(value) {
    		throw new Error("<Messages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get i() {
    		throw new Error("<Messages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set i(value) {
    		throw new Error("<Messages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.4.4 */

    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	var form, input0, t0, input1, t1, div, t2, current, dispose;

    	var messages0 = new Messages({
    		props: { msgs: ctx.msgs, i: 1 },
    		$$inline: true
    	});
    	messages0.$on("delmsg", ctx.delMessage);

    	var messages1 = new Messages({
    		props: { msgs: ctx.msgs, i: 2 },
    		$$inline: true
    	});
    	messages1.$on("delmsg", ctx.delMessage);

    	return {
    		c: function create() {
    			form = element("form");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			div = element("div");
    			messages0.$$.fragment.c();
    			t2 = space();
    			messages1.$$.fragment.c();
    			attr(input0, "type", "text");
    			add_location(input0, file$1, 33, 1, 510);
    			attr(input1, "type", "submit");
    			input1.className = "svelte-133nmu5";
    			add_location(input1, file$1, 34, 1, 555);
    			add_location(form, file$1, 32, 0, 479);
    			set_style(div, "display", "flex");
    			add_location(div, file$1, 36, 0, 585);

    			dispose = [
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(form, "submit", ctx.newMessage)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, form, anchor);
    			append(form, input0);

    			input0.value = ctx.newMsgText;

    			append(form, t0);
    			append(form, input1);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			mount_component(messages0, div, null);
    			append(div, t2);
    			mount_component(messages1, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.newMsgText && (input0.value !== ctx.newMsgText)) input0.value = ctx.newMsgText;

    			var messages0_changes = {};
    			if (changed.msgs) messages0_changes.msgs = ctx.msgs;
    			messages0.$set(messages0_changes);

    			var messages1_changes = {};
    			if (changed.msgs) messages1_changes.msgs = ctx.msgs;
    			messages1.$set(messages1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			messages0.$$.fragment.i(local);

    			messages1.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			messages0.$$.fragment.o(local);
    			messages1.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(form);
    				detach(t1);
    				detach(div);
    			}

    			messages0.$destroy();

    			messages1.$destroy();

    			run_all(dispose);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let msgs = ['a', 'b', 'c'];
    	let newMsgText = '';

    	function delMessage(event){
    		let index = event.detail.index;
    		$$invalidate('msgs', msgs = msgs.filter(m => m!=msgs[index]));
    	}

    	function newMessage(e){
    		e.preventDefault();
    		$$invalidate('msgs', msgs = [...msgs, newMsgText]);
    		$$invalidate('newMsgText', newMsgText = '');
    	}

    	function input0_input_handler() {
    		newMsgText = this.value;
    		$$invalidate('newMsgText', newMsgText);
    	}

    	return {
    		msgs,
    		newMsgText,
    		delMessage,
    		newMessage,
    		input0_input_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
