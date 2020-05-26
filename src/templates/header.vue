<!--
Copyright 2020 DigitalOcean

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
    <div class="header">
        <div class="container">
            <div>
                <h1><a :href="baseUrl">{{ this.$props.title }}</a></h1>
                <h3><slot name="description"></slot></h3>
                <slot name="header"></slot>
            </div>

            <form autocomplete="on" @submit.prevent="emitFormEvent">
                <div class="input-container">
                    <slot name="input"></slot>
                </div>
                <div class="buttons">
                    <slot name="buttons"></slot>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        props: {
            title: String,
        },
        data() {
            return {
                baseUrl: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
            };
        },
        methods: {
            emitFormEvent() {
                this.$emit('form-event');
            },
        },
    };
</script>
