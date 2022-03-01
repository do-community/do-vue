<!--
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
    <PrettyInput>
        <template v-for="(_, slot) in $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </PrettyInput>
</template>

<script setup>
    import PrettyInput from 'pretty-checkbox-vue/src/PrettyInput';

    // Vue 3 fix: Remove top-level model as it's unused
    Reflect.deleteProperty(PrettyInput, 'model');

    // Vue 3 fix: Patch in the correct vnode object
    PrettyInput.mounted = (original => function (...args) {
        return original.apply(new Proxy(this, {
            get: (target, key) => key === '$vnode'
                ? Reflect.get(target, '$').vnode
                : Reflect.get(target, key),
        }), args);
    })(PrettyInput.mounted);

    // Vue 3 fix: Patch in firing update:modelValue event on input change
    PrettyInput.methods.updateInput = (original => function (...args) {
        return original.apply(new Proxy(this, {
            get: (target, key) => key === '$emit'
                ? function (event, ...eventArgs) {
                    if (event === 'change')
                        Reflect.get(target, key).apply(this, ['update:modelValue'].concat(eventArgs));
                    return Reflect.get(target, key).apply(this, [event].concat(eventArgs));
                }
                : Reflect.get(target, key),
        }), args);
    })(PrettyInput.methods.updateInput);
</script>
