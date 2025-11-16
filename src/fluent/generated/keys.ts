import '@servicenow/sdk/global'

interface KeysRegistry {
    explicit?: Record<string, { table: string; id: string }>
    composite?: Array<{ table: string; id: string; key: Record<string, any> }>
}

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'd5a641187f274f8fac975cde468a8769'
                    }
                    'crew-availability-portal': {
                        table: 'sys_ui_page'
                        id: '2b329c580cc64f50b1b1165c53dd47fc'
                    }
                    'crew-schedule-defaults': {
                        table: 'sys_script'
                        id: '6a47da1d0e2e4f9da6963d8c6e086c51'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '2788cfcf5d204ef2a0e70c3a10b7e64a'
                    }
                    'skyserve-customer-portal': {
                        table: 'sys_ui_page'
                        id: '186bd817eead40849eaace35e3dfb55f'
                    }
                    'src_server_crew-schedule-defaults_js': {
                        table: 'sys_module'
                        id: 'ff7c450a6d7c4b49991f5e18d4add69b'
                    }
                    'x_1603915_airspeed/____insertStyle-CHA8o0zu': {
                        table: 'sys_ux_lib_asset'
                        id: 'b4f23ee631a54d12b8477cd93a284b30'
                    }
                    'x_1603915_airspeed/____insertStyle-CHA8o0zu.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'c4b5d2491d6547fab18a30541d6c2050'
                    }
                    'x_1603915_airspeed/booking-main': {
                        table: 'sys_ux_lib_asset'
                        id: '1da58f44b8584a66ac21f5e0b31c33fc'
                    }
                    'x_1603915_airspeed/booking-main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: '31bfde61b1af485aa8b75b0543bd2451'
                    }
                    'x_1603915_airspeed/crew-main': {
                        table: 'sys_ux_lib_asset'
                        id: '2eac1b5e09f54d4fad8a612daefd5c9f'
                    }
                    'x_1603915_airspeed/crew-main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'a674b715700b4407b0deecfbad3afdb2'
                    }
                }
                composite: [
                    {
                        table: 'sys_choice'
                        id: '04bf79ae08bd47aa8b86b74a1108c62a'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'compliance_check'
                            value: 'violation'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0878f7a66ee146f19be1ab1f20cf7ee6'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            value: 'closed'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0f3f25e65890485ba745b0aa2bd63e85'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'preferred_class'
                            value: 'economy'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '167fc77a561d4b048e59f6eaa162e5c4'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3397f398e6534651b0ad494266f8c7ec'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'flight_number'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '382acfcf9f0c4f8ab6d9b6c41c49f08b'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'destination'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '413e180173414194948d868d0c58907a'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            value: 'rejected'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '440322bd943a45e9b79d530031f67ff4'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'optimized_duty_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4545804495874fe180eba636e143f861'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'departure_datetime'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4795b0abdf174ca9925770e858a2a99e'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'compliance_check'
                            value: 'warning'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '489fa91156364b8cb236118f9c0dffdd'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'origin'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '53ecf69436fb4fe99bbe1d2669df5dc4'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            value: 'availability_submitted'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5e45dce923294e06b93af72eed1eda8e'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5fc8888ac22c4a349d62fb9ec7648e22'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'destination'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '60b7882b9c5e43048c660aee38311aec'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'compliance_check'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '620ffc1c9aad4a38b00278a62d3685ab'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'preferred_class'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6655ceafd25143c1b9578c6328f9aebf'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6d5b33c598154862b398ca9d3db23140'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'manager_approval'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '6da590c9eb5b44599b0fc3231769af5f'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6e903b7b8e134249add0a5ec90a132cc'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'preferred_class'
                            value: 'business'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '734fb65644b548c389e4de2dd9c82586'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '737197c0acc445baa18362074f3e1d63'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'compliance_check'
                            value: 'pass'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '7e214b8ac80b40be978b77e3fc6b6582'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '86380fdadb5043dfa80ea47ca9565d37'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'meal_preference'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8f1608d210b548e5a295047e115a7c32'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            value: 'draft_schedule'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '90d9814ac1404e66bdbc17ef5acfc621'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'meal_preference'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '95f5dc8c091b497db1f09f16ff5228c7'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'requested_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '99c82c6a297945518c4a08beed435d0c'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'violation_details'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9bb58235dea846a2918cc919cfb8a745'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'origin'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c70ab1ea6514f82a0789c5b5411e6d6'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9e48d79e55da4a228fea15ab5972f9cb'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'crew_member'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a33ddd79c28946fa801f7accb0bf1792'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            value: 'conflict'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a560b912c8ab41fda25aef23c24cff2b'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'crew_member'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ae0a2e8fa1384f709bac3179012d1f85'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'genai_recommendation'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aeb1e4f71f40453f96b17fabd5b16063'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'optimized_duty_time'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b6af421b3f7c45688fe5b7bd10b57ad4'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'violation_details'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bb23f9f726b742f38ac326a1a19f8461'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'flight_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3a9ff35f7e34a3a8874f2b0de4e8d9d'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3c4a9fdc8ac4e889bb6a670dd6ac165'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'flight_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ca56a2e6c8b14a34875808a5c06cd6cf'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'caab1404dacc4ca09a1102dc9d9ea401'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'genai_recommendation'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd14b6cddaef4448c80b5118bc3349871'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'status'
                            value: 'approved_schedule'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd2eae66671d74cf088c93a41c9dadc4b'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'manager_approval'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7e841811139407f802f001deff8db7a'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'departure_datetime'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dc9872031a4249d2910850bb976e43ca'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'preferred_class'
                            value: 'first'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de3c4c1b83154a4cafc4efb1649eed63'
                        key: {
                            name: 'x_1603915_airspeed_crew_schedule'
                            element: 'compliance_check'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e0e3c9738a2840658a5a4469ae5a3524'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'flight_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ebcb43c8754d4368ad7686a77693c5cd'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'preferred_class'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ed0834befc2e461cb8a7656a654785bd'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                            element: 'requested_by'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f47c7a16648a46b783e604d3145365f8'
                        key: {
                            name: 'x_1603915_airspeed_flight_booking'
                        }
                    },
                ]
            }
        }
    }
}
