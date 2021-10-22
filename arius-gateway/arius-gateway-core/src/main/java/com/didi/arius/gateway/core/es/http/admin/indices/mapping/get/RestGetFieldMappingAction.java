/*
 * Licensed to Elasticsearch under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package com.didi.arius.gateway.core.es.http.admin.indices.mapping.get;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.didi.arius.gateway.common.consts.QueryConsts;
import com.didi.arius.gateway.common.metadata.IndexTemplate;
import com.didi.arius.gateway.common.metadata.QueryContext;
import com.didi.arius.gateway.core.es.http.RestActionListenerImpl;
import com.didi.arius.gateway.core.es.http.StatAction;
import com.didi.arius.gateway.elasticsearch.client.ESClient;
import com.didi.arius.gateway.elasticsearch.client.gateway.direct.DirectResponse;
import com.google.common.collect.Lists;
import org.elasticsearch.common.Strings;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestChannel;
import org.elasticsearch.rest.RestRequest;
import org.elasticsearch.rest.RestStatus;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.didi.arius.gateway.common.utils.CommonUtil.isIndexType;

/**
 *
 */
@Component
public class RestGetFieldMappingAction extends StatAction {

    public static final String NAME = "restGetFieldMapping";

    @Override
    public String name() {
        return NAME;
    }


    @Override
    protected void handleInterRequest(QueryContext queryContext, RestRequest request, RestChannel channel, ESClient client)
            throws Exception {
        String index = request.param("index");
        if (index == null) {
            sendDirectResponse(queryContext, new BytesRestResponse(RestStatus.OK, XContentType.JSON.restContentType(), "{}"));
            return;
        }

        if (isIndexType(queryContext)) {
            String[] indicesArr = Strings.splitStringByCommaToArray(request.param("index"));
            List<String> indices = Lists.newArrayList(indicesArr);
            IndexTemplate indexTemplate = getTemplateByIndexTire(indices, queryContext);

            client = esClusterService.getClient(queryContext, indexTemplate);
        }

        if (queryContext.isFromKibana() && !queryContext.isNewKibana() && !client.getEsVersion().startsWith(QueryConsts.ES_VERSION_2_PREFIX)) {
            ESClient finalClient = client;
            RestActionListenerImpl<DirectResponse> listener = new RestActionListenerImpl<DirectResponse>(queryContext) {
                @Override
                public void onResponse(DirectResponse response) {
                    if (response.getRestStatus() == RestStatus.OK) {
                        JSONObject res = JSON.parseObject(response.getResponseContent());

                        // for kibana
                        // 遍历索引
                        for (Map.Entry<String, Object> entry : res.entrySet()) {
                            JSONObject index = (JSONObject) entry.getValue();
                            JSONObject mappings = index.getJSONObject("mappings");

                            if (mappings == null || mappings.size() == 0) {
                                continue;
                            }

                            // 遍历mappings
                            if (finalClient.getEsVersion().startsWith(QueryConsts.ES_VERSION_7_PREFIX)) {
                                //7.x single type
                                String text = mappings.toJSONString();
                                Set<String> keySet = new HashSet<>(mappings.keySet());
                                keySet.forEach(key -> mappings.remove(key));
                                mappings.put("_doc", JSON.parseObject(text));
                            }
                            for (Map.Entry<String, Object> inEntry : mappings.entrySet()) {
                                JSONObject type = (JSONObject) inEntry.getValue();

                                //遍历type
                                for (Map.Entry<String, Object> typeEntry : type.entrySet()) {
                                    JSONObject field = (JSONObject) typeEntry.getValue();
                                    handleMapping(field);
                                }
                            }
                        }

                        response.setResponseContent(res.toJSONString());
                    }

                    super.onResponse(response);
                }
            };

            directRequest(client, queryContext, listener);
        } else {
            directRequest(client, queryContext);
        }

    }

    private void handleMapping(JSONObject field) {
        if (field.containsKey("mapping")) {
            JSONObject mapping = field.getJSONObject("mapping");

            //遍历field
            for (Map.Entry<String, Object> mappingEntry : mapping.entrySet()) {
                JSONObject fieldType = (JSONObject) mappingEntry.getValue();
                if (fieldType.containsKey("type")) {
                    String strType = fieldType.getString("type");
                    String isIndex = fieldType.getString("index");
                    if (strType.equalsIgnoreCase("text")) {
                        fieldType.put("type", "string");
                        if (isIndex == null || isIndex.equals("true")) {
                            fieldType.put("index", "analyzed");
                        }
                    } else if (strType.equalsIgnoreCase("keyword")) {
                        fieldType.put("type", "string");
                        if (isIndex == null || isIndex.equals("true")) {
                            fieldType.put("index", "not_analyzed");
                        }
                    }
                }

                //如果type包含fields，则继续处理fields
                if (fieldType.containsKey("fields")) {
                    for (Map.Entry<String, Object> fieldsEntry : fieldType.getJSONObject("fields").entrySet()) {
                        JSONObject fields = (JSONObject) fieldsEntry.getValue();
                        if (fields.containsKey("type")) {
                            String strType = fields.getString("type");
                            String isIndex = fields.getString("index");
                            if (strType.equalsIgnoreCase("text")) {
                                fields.put("type", "string");
                                if (isIndex == null || isIndex.equals("true")) {
                                    fields.put("index", "analyzed");
                                }
                            } else if (strType.equalsIgnoreCase("keyword")) {
                                fields.put("type", "string");
                                if (isIndex == null || isIndex.equals("true")) {
                                    fields.put("index", "not_analyzed");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}